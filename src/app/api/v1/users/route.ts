import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createJWT } from "@/server/lib/jwt";

const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const { name } = await request.json();
  const user = await prisma.user.create({
    data: { name },
  });
  const accessToken = await createJWT(user.id);
  return NextResponse.json({ data: user, accessToken }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const { userId, userName } = await request.json();
  const user = await prisma.user.update({
    where: { id: userId },
    data: { name: userName },
  });
  return NextResponse.json({ data: user }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { userId } = await request.json();
  const user = await prisma.user.delete({
    where: { id: userId },
  });
  return NextResponse.json({ data: user }, { status: 201 });
}
