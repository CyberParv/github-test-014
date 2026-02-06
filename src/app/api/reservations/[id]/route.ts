import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const updateSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
  datetime: z.string().datetime().optional(),
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const role = (req.headers as any).get("x-user-role");
    if (role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    const reservation = await prisma.reservation.findUnique({ where: { id: params.id } });
    if (!reservation) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: reservation }, { status: 200 });
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
    const data: any = { ...parsed.data };
    if (data.datetime) data.datetime = new Date(data.datetime);
    const reservation = await prisma.reservation.update({ where: { id: params.id }, data });
    return NextResponse.json({ success: true, data: reservation }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const role = (req.headers as any).get("x-user-role");
    if (role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    await prisma.reservation.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { deleted: true } }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
