import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth/prisma";

export async function GET() {
  try {
    const settings = await prisma.globalSetting.findMany({
      where: { key: { in: ["conseilEmoji", "conseilTitre", "conseilTexte"] } },
    });

    const map = settings.reduce((acc, s) => { acc[s.key] = s.value; return acc; }, {} as Record<string, string>);

    return NextResponse.json({
      emoji: map.conseilEmoji ?? "🍓",
      titre: map.conseilTitre ?? "Le conseil du primeur",
      texte: map.conseilTexte ?? "Les fraises sont particulièrement sucrées cette semaine.",
    });
  } catch (error) {
    console.error("GET_CONSEIL_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
