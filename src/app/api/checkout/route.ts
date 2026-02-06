import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  fulfillment: z.enum(["pickup", "delivery"]),
  contact: z.record(z.string()),
});

export async function POST(req: Request) {
  try {
    const userId = (req.headers as any).get("x-user-id");
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });

    const cartItems = await prisma.cartItem.findMany({ where: { userId }, include: { menuItem: true } });
    if (cartItems.length === 0) return NextResponse.json({ success: false, error: "Cart is empty" }, { status: 400 });

    const items = cartItems.map((c) => ({ menuItemId: c.menuItemId, quantity: c.quantity, price: c.menuItem.price }));
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: "pending",
        fulfillment: parsed.data.fulfillment,
        contact: parsed.data.contact,
        items: { create: items },
      },
    });

    await prisma.cartItem.deleteMany({ where: { userId } });

    return NextResponse.json({ success: true, data: { orderId: order.id, status: order.status } }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
