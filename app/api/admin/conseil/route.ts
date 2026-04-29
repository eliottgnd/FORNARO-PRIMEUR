import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user.role === "ADMIN";
}

export async function GET() {
  try {
    if (!await checkAdmin()) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

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
    console.error("GET_ADMIN_CONSEIL_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    if (!await checkAdmin()) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { emoji, titre, texte } = await req.json();

    await Promise.all([
      prisma.globalSetting.upsert({
        where: { key: "conseilEmoji" },
        update: { value: emoji },
        create: { key: "conseilEmoji", value: emoji },
      }),
      prisma.globalSetting.upsert({
        where: { key: "conseilTitre" },
        update: { value: titre },
        create: { key: "conseilTitre", value: titre },
      }),
      prisma.globalSetting.upsert({
        where: { key: "conseilTexte" },
        update: { value: texte },
        create: { key: "conseilTexte", value: texte },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT_ADMIN_CONSEIL_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
