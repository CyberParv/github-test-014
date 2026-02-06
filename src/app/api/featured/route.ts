import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const items = await prisma.menuItem.findMany({ where: { available: true }, take: 6, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
