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
    const { cities, ...productData } = body;

    const parsedCities = cities
      ? (typeof cities === "string" ? cities.split(',').filter(Boolean) : (Array.isArray(cities) ? cities : []))
      : [];

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: productData.name,
        category: productData.category,
        description: productData.description,
        price: productData.price ? parseFloat(productData.price) : undefined,
        unit: productData.unit,
        origin: productData.origin,
        image: productData.image,
        badge: productData.badge,
        stockQuantity: productData.stockQuantity ? parseInt(productData.stockQuantity) : undefined,
        availabilities: {
          deleteMany: {},
          create: parsedCities.map((city: string) => ({ city })),
        },
      },
      include: { availabilities: true },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("PATCH_PRODUCT_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE_PRODUCT_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
