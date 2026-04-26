import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getSession() {
  return await getServerSession(authOptions);
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { user: { email: session.user.email } },
      include: { product: { include: { promotions: { where: { isActive: true }, take: 1 } } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(favorites.map(f => f.product));
  } catch (error) {
    console.error("GET_FAVORITES_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ message: "Product ID required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const favorite = await prisma.favorite.create({
      data: { userId: user.id, productId },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error("POST_FAVORITE_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    if (!productId) {
      return NextResponse.json({ message: "Product ID required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await prisma.favorite.deleteMany({
      where: { userId: user.id, productId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE_FAVORITE_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}