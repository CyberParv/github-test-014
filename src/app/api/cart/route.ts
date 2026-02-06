import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const addSchema = z.object({
  menuItemId: z.string(),
  quantity: z.number().int().positive().default(1),
});

const updateSchema = z.object({
  id: z.string(),
  quantity: z.number().int().positive(),
});

export async function GET(req: Request) {
  try {
    const userId = (req.headers as any).get("x-user-id");
    const items = await prisma.cartItem.findMany({ where: { userId }, include: { menuItem: true } });
    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = (req.headers as any).get("x-user-id");
    const body = await req.json();
    const parsed = addSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });

    const existing = await prisma.cartItem.findFirst({ where: { userId, menuItemId: parsed.data.menuItemId } });
    if (existing) {
      const updated = await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + parsed.data.quantity } });
      return NextResponse.json({ success: true, data: updated }, { status: 200 });
    }

    const item = await prisma.cartItem.create({ data: { userId, menuItemId: parsed.data.menuItemId, quantity: parsed.data.quantity } });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const userId = (req.headers as any).get("x-user-id");
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    const item = await prisma.cartItem.findUnique({ where: { id: parsed.data.id } });
    if (!item || item.userId !== userId) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    const updated = await prisma.cartItem.update({ where: { id: parsed.data.id }, data: { quantity: parsed.data.quantity } });
    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = (req.headers as any).get("x-user-id");
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
    const item = await prisma.cartItem.findUnique({ where: { id } });
    if (!item || item.userId !== userId) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    await prisma.cartItem.delete({ where: { id } });
    return NextResponse.json({ success: true, data: { deleted: true } }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
