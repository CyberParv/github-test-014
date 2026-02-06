import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;
  const auth = await getAuthFromRequest(req);

  const protectedPaths = ["/api/admin", "/api/orders", "/api/reservations", "/api/reviews", "/api/cart", "/api/checkout", "/api/users"];

  if (protectedPaths.some((p) => url.startsWith(p))) {
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", auth.payload.userId);
    requestHeaders.set("x-user-role", auth.payload.role);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (auth) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", auth.payload.userId);
    requestHeaders.set("x-user-role", auth.payload.role);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
