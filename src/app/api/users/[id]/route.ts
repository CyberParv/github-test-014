import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const updateSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  role: z.enum(["customer", "admin"]).optional(),
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const role = (req.headers as any).get("x-user-role");
    if (role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    const user = await prisma.user.findUnique({ where: { id: params.id }, select: { id: true, email: true, name: true, role: true, createdAt: true } });
    if (!user) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: user }, { status: 200 });
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
    const user = await prisma.user.update({ where: { id: params.id }, data: parsed.data, select: { id: true, email: true, name: true, role: true, createdAt: true } });
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const role = (req.headers as any).get("x-user-role");
    if (role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { deleted: true } }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
