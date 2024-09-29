import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (userId) {
      const posts = await prisma.post.findMany({
        where: { userId },
      });
      return NextResponse.json(posts);
    }

    const posts = await prisma.post.findMany();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, please try again." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const userId = request.headers.get("x-user-id");
  if (userId === "" || !userId) return NextResponse.json({ status: 403 });
  const { title, content } = await request.json();
  const post = await prisma.post.create({
    data: { title, content, userId },
  });
  return NextResponse.json(post, { status: 201 });
}
