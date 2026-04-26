import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        promotions: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        availabilities: {
          select: { city: true }
        },
      },
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const result = {
      ...product,
      availabilities: product.availabilities?.map((a) => a.city) || [],
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET_PRODUCT_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}