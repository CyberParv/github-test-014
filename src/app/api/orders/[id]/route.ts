import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const updateSchema = z.object({
  status: z.enum(["pending", "confirmed", "preparing", "ready", "completed", "cancelled"]).optional(),
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = (req.headers as any).get("x-user-id");
    const role = (req.headers as any).get("x-user-role");
    const order = await prisma.order.findUnique({ where: { id: params.id }, include: { items: true } });
    if (!order) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    if (role !== "admin" && order.userId !== userId) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ success: true, data: order }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const role = (req.headers as any).get("x-user-role");
    if (role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    const order = await prisma.order.update({ where: { id: params.id }, data: parsed.data, include: { items: true } });
    return NextResponse.json({ success: true, data: order }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const role = (req.headers as any).get("x-user-role");
    if (role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    await prisma.order.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { deleted: true } }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
