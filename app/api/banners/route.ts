import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth/prisma";

export async function GET() {
  try {
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
    console.error("GET_BANNER_PUBLIC_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
