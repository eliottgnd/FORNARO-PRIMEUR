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

    const promotions = await prisma.promotion.findMany({
      include: {
        product: {
          select: { name: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(promotions);
  } catch (error) {
    console.error("GET_PROMOTIONS_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, discountPercent, label } = body;

    if (!productId || !discountPercent) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const promotion = await prisma.promotion.create({
      data: {
        productId,
        discountPercent: parseInt(discountPercent),
        label: label || `${discountPercent}% de réduction`,
        isActive: true,
      },
    });

    return NextResponse.json(promotion, { status: 201 });
  } catch (error) {
    console.error("POST_PROMOTION_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
