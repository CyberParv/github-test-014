import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const createSchema = z.object({
  name: z.string().min(1),
  order: z.number().int().optional(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || undefined;
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const sort = searchParams.get("sort") || "order";
    const order = searchParams.get("order") === "desc" ? "desc" : "asc";

    const where = q ? { name: { contains: q, mode: "insensitive" as const } } : {};
    const [items, total] = await Promise.all([
      prisma.category.findMany({ skip: (page - 1) * limit, take: limit, where, orderBy: { [sort]: order } }),
      prisma.category.count({ where }),
    ]);
    return NextResponse.json({ success: true, data: { items, total } }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const role = (req.headers as any).get("x-user-role");
    if (role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    const category = await prisma.category.create({ data: parsed.data });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
