import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    if (!q) return NextResponse.json({ success: true, data: { items: [] } }, { status: 200 });
    const items = await prisma.menuItem.findMany({ where: { name: { contains: q, mode: "insensitive" } }, take: 20 });
    return NextResponse.json({ success: true, data: { items } }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
