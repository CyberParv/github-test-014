import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ success: true, data: { status: "ok", uptimeSeconds: process.uptime(), timestamp: new Date().toISOString() } }, { status: 200 });
}
