import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const role = (req.headers as any).get("x-user-role");
    if (role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    const totalSales = await prisma.order.aggregate({ _sum: { total: true } });
    const orders = await prisma.order.count();
    const topItems = await prisma.orderItem.groupBy({ by: ["menuItemId"], _sum: { quantity: true }, orderBy: { _sum: { quantity: "desc" } }, take: 5 });
    return NextResponse.json({ success: true, data: { salesTotal: totalSales._sum.total || 0, orders, topItems: topItems.map((t) => ({ menuItemId: t.menuItemId, sold: t._sum.quantity || 0 })) } }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
