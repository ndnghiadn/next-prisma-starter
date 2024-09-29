import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createJWT } from "@/lib/jwt";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, please try again." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    const user = await prisma.user.create({
      data: { name },
    });
    const accessToken = await createJWT(user.id);
    return NextResponse.json({ data: user, accessToken }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, please try again." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId, userName } = await request.json();
    const post = await prisma.user.update({
      where: { id: userId },
      data: { name: userName },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json();
    const post = await prisma.user.delete({
      where: { id: userId },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, please try again." },
      { status: 500 }
    );
  }
}
