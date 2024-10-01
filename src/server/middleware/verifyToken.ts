import { NextResponse } from "next/server";
import { verifyJWT } from "../lib/jwt";

export async function verifyToken(token: string | null) {
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const userId = await verifyJWT(token);
    const response = NextResponse.next();
    response.headers.set("x-user-id", userId);
    return response;
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 403 });
  }
}
