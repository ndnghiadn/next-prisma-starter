import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/jwt";

const protectedRoutes = ["/api/v1/posts"];

export async function middleware(request: NextRequest) {
  if (
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    const token = request.headers.get("Authorization");
    if (token) {
      try {
        const payload = await verifyJWT(token);
        console.log("payload ne", payload);
        const response = NextResponse.next();
        response.headers.set("x-user-id", payload as string);
        return response;
      } catch (error) {
        return NextResponse.json({ message: "Invalid token" }, { status: 403 });
      }
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  NextResponse.next();
}

export const config = {
  matcher: "/api/v1/:path*",
};
