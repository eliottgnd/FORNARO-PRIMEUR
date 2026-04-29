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
    const { productId, type = "percent", discountPercent, discountAmount, bundleQuantity, bundlePrice, label } = body;

    if (!productId) {
      return NextResponse.json({ message: "Produit requis" }, { status: 400 });
    }

    if (type === "percent" && !discountPercent) {
      return NextResponse.json({ message: "Pourcentage requis" }, { status: 400 });
    }
    if (type === "fixed" && !discountAmount) {
      return NextResponse.json({ message: "Montant de réduction requis" }, { status: 400 });
    }
    if (type === "bundle" && (!bundleQuantity || !bundlePrice)) {
      return NextResponse.json({ message: "Quantité et prix du lot requis" }, { status: 400 });
    }

    let autoLabel = label;
    if (!autoLabel) {
      if (type === "percent") autoLabel = `-${discountPercent}%`;
      else if (type === "fixed") autoLabel = `-${discountAmount}€`;
      else autoLabel = `${bundleQuantity} pour ${bundlePrice}€`;
    }

    const promotion = await prisma.promotion.create({
      data: {
        productId,
        type,
        discountPercent: type === "percent" ? parseInt(discountPercent) : null,
        discountAmount: type === "fixed" ? parseFloat(discountAmount) : null,
        bundleQuantity: type === "bundle" ? parseInt(bundleQuantity) : null,
        bundlePrice: type === "bundle" ? parseFloat(bundlePrice) : null,
        label: autoLabel,
        isActive: true,
      },
    });

    return NextResponse.json(promotion, { status: 201 });
  } catch (error) {
    console.error("POST_PROMOTION_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
