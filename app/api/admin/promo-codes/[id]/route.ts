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

    const updatedCode = await prisma.promoCode.update({
      where: { id },
      data: {
        ...body,
        discountPercent: body.discountPercent ? parseInt(body.discountPercent) : undefined,
        usageLimit: body.usageLimit ? parseInt(body.usageLimit) : undefined,
      },
    });

    return NextResponse.json(updatedCode);
  } catch (error) {
    console.error("PATCH_PROMOCODE_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.promoCode.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Promo code deleted successfully" });
  } catch (error) {
    console.error("DELETE_PROMOCODE_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
