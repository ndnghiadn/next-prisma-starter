import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "./server/middleware/verifyToken";

const protectedRoutes = ["/api/v1/posts"];

export async function middleware(request: NextRequest) {
  if (
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    const token = request.headers.get("Authorization");
    return await verifyToken(token);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/v1/:path*",
};
