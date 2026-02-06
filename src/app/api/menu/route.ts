import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  currency: z.string().optional(),
  imageUrl: z.string().url().optional(),
  categoryId: z.string().optional(),
  available: z.boolean().optional(),
  variants: z.array(z.object({ name: z.string(), price: z.number().positive() })).optional(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const q = searchParams.get("q") || undefined;
    const available = searchParams.get("available");
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";

    const where: any = {};
    if (category) where.categoryId = category;
    if (q) where.name = { contains: q, mode: "insensitive" };
    if (available !== null && available !== undefined) where.available = available === "true";

    const [items, total] = await Promise.all([
      prisma.menuItem.findMany({ skip: (page - 1) * limit, take: limit, where, orderBy: { [sort]: order }, include: { category: true } }),
      prisma.menuItem.count({ where }),
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
    const item = await prisma.menuItem.create({ data: parsed.data });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
