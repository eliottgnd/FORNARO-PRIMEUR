import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, orderId } = body;

    if (!code || !orderId) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const promoCode = await prisma.promoCode.findUnique({
      where: { code },
    });

    if (!promoCode || !promoCode.isActive) {
      return NextResponse.json({ message: "Code invalide ou expiré" }, { status: 400 });
    }

    if (promoCode.usageLimit && promoCode.currentUsage >= promoCode.usageLimit) {
      return NextResponse.json({ message: "Limite d'utilisation atteinte" }, { status: 400 });
    }

    const discount = promoCode.discountPercent;

    // Increment usage
    await prisma.promoCode.update({
      where: { id: promoCode.id },
      data: { currentUsage: { increment: 1 } },
    });

    return NextResponse.json({
      message: "Code appliqué !",
      discountPercent: discount
    });
  } catch (error) {
    console.error("PROMO_CODE_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
