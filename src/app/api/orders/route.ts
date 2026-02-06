import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const createSchema = z.object({
  items: z.array(z.object({ menuItemId: z.string(), quantity: z.number().int().positive() })),
  contact: z.record(z.string()),
  fulfillment: z.enum(["pickup", "delivery"]),
  notes: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const userId = (req.headers as any).get("x-user-id");
    const role = (req.headers as any).get("x-user-role");
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";

    const where = role === "admin" ? {} : { userId };
    const [items, total] = await Promise.all([
      prisma.order.findMany({ skip: (page - 1) * limit, take: limit, where, orderBy: { [sort]: order }, include: { items: true } }),
      prisma.order.count({ where }),
    ]);
    return NextResponse.json({ success: true, data: { items, total } }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = (req.headers as any).get("x-user-id");
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });

    const menuItems = await prisma.menuItem.findMany({ where: { id: { in: parsed.data.items.map((i) => i.menuItemId) } } });
    const priceMap = new Map(menuItems.map((m) => [m.id, m.price]));
    const itemsWithPrice = parsed.data.items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity, price: priceMap.get(i.menuItemId) || 0 }));
    const total = itemsWithPrice.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: "pending",
        fulfillment: parsed.data.fulfillment,
        contact: parsed.data.contact,
        items: { create: itemsWithPrice },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, data: { orderId: order.id, status: order.status } }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
