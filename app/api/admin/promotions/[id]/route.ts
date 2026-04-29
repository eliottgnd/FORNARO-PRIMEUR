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

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { type, discountPercent, discountAmount, bundleQuantity, bundlePrice, ...rest } = body;

    const data: Record<string, unknown> = { ...rest };

    if (type) {
      data.type = type;
      data.discountPercent = type === "percent" && discountPercent ? parseInt(discountPercent) : null;
      data.discountAmount = type === "fixed" && discountAmount ? parseFloat(discountAmount) : null;
      data.bundleQuantity = type === "bundle" && bundleQuantity ? parseInt(bundleQuantity) : null;
      data.bundlePrice = type === "bundle" && bundlePrice ? parseFloat(bundlePrice) : null;
    } else {
      if (discountPercent !== undefined) data.discountPercent = discountPercent ? parseInt(discountPercent) : null;
      if (discountAmount !== undefined) data.discountAmount = discountAmount ? parseFloat(discountAmount) : null;
      if (bundleQuantity !== undefined) data.bundleQuantity = bundleQuantity ? parseInt(bundleQuantity) : null;
      if (bundlePrice !== undefined) data.bundlePrice = bundlePrice ? parseFloat(bundlePrice) : null;
    }

    const updatedPromotion = await prisma.promotion.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedPromotion);
  } catch (error) {
    console.error("PATCH_PROMOTION_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.promotion.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Promotion deleted successfully" });
  } catch (error) {
    console.error("DELETE_PROMOTION_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
