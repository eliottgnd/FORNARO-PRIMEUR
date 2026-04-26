import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
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

    const banner = await prisma.globalSetting.findUnique({
      where: { key: "promo_banner" },
    });

    if (!banner) {
      return NextResponse.json({
        texte: "Livraison gratuite dès 20€ !",
        emoji: "🚚",
        couleur: "vert",
        actif: false
      });
    }

    return NextResponse.json(JSON.parse(banner.value));
  } catch (error) {
    console.error("GET_BANNER_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    await prisma.globalSetting.upsert({
      where: { key: "promo_banner" },
      update: { value: JSON.stringify(body) },
      create: { key: "promo_banner", value: JSON.stringify(body) },
    });

    return NextResponse.json({ message: "Banner updated successfully" });
  } catch (error) {
    console.error("POST_BANNER_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
