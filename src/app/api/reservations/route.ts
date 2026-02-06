import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const createSchema = z.object({
  name: z.string().min(1),
  contact: z.string().min(1),
  partySize: z.number().int().positive(),
  datetime: z.string().datetime(),
});

export async function GET(req: Request) {
  try {
    const role = (req.headers as any).get("x-user-role");
    if (role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const status = searchParams.get("status") || undefined;
    const date = searchParams.get("date") || undefined;

    const where: any = {};
    if (status) where.status = status;
    if (date) where.datetime = { gte: new Date(date), lt: new Date(new Date(date).getTime() + 86400000) };

    const [items, total] = await Promise.all([
      prisma.reservation.findMany({ skip: (page - 1) * limit, take: limit, where, orderBy: { datetime: "asc" } }),
      prisma.reservation.count({ where }),
    ]);
    return NextResponse.json({ success: true, data: { items, total } }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });

    const reservation = await prisma.reservation.create({
      data: { ...parsed.data, datetime: new Date(parsed.data.datetime), status: "pending" },
    });
    return NextResponse.json({ success: true, data: { reservationId: reservation.id, status: reservation.status } }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
