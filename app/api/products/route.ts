import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        promotions: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        availabilities: city
          ? {
              where: { city },
            }
          : {
              select: { city: true }
            },
      },
    });

    // If city filter is applied, only return products available in that city
    const filtered = city
      ? products.filter((p) => p.availabilities && p.availabilities.length > 0)
      : products;

    // Return products with their city list for cart availability tracking
    const result = filtered.map((p) => ({
      ...p,
      availabilities: p.availabilities?.map((a: any) => a.city) || [],
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET_PRODUCTS_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
