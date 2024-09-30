import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (userId) {
    const posts = await prisma.post.findMany({
      where: { userId },
    });
    return NextResponse.json({ data: posts });
  }

  const posts = await prisma.post.findMany();
  return NextResponse.json({ data: posts });
}

export async function POST(request: NextRequest) {
  const userId = request.headers.get("x-user-id") as string;
  const { title, content } = await request.json();
  const post = await prisma.post.create({
    data: { userId, title, content },
  });
  return NextResponse.json({ data: post }, { status: 201 });
}
