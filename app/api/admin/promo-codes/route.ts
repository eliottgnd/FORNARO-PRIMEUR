import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return false;
  }
  return true;
}

export async function GET() {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const codes = await prisma.promoCode.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(codes);
  } catch (error) {
    console.error("GET_PROMOCODES_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { code, discountPercent, usageLimit } = body;

    if (!code || !discountPercent) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const promoCode = await prisma.promoCode.create({
      data: {
        code,
        discountPercent: parseInt(discountPercent),
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        isActive: true,
      },
    });

    return NextResponse.json(promoCode, { status: 201 });
  } catch (error) {
    console.error("POST_PROMOCODE_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
