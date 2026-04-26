import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  console.log("Admin Check Session:", session?.user);
  if (!session || session.user?.role !== "ADMIN") {
    return false;
  }
  return true;
}

export async function GET() {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      include: { availabilities: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET_PRODUCTS_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, category, price, unit, origin, image, badge, stockQuantity, description, cities } = body;

    if (!name || !category || !price) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const parsedCities = cities ? (typeof cities === "string" ? cities.split(',').filter(Boolean) : (Array.isArray(cities) ? cities : [])) : [];

    const product = await prisma.product.create({
      data: {
        name,
        category,
        price: parseFloat(price),
        unit,
        origin,
        image,
        badge,
        stockQuantity: parseInt(stockQuantity || "0"),
        description,
        availabilities: {
          create: parsedCities.map((city: string) => ({ city })),
        },
      },
      include: { availabilities: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST_PRODUCT_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
