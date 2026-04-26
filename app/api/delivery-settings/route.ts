import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth/prisma";

export async function GET() {
  try {
    const settings = await prisma.globalSetting.findMany();

    const config = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    const zonesActives = config.zonesActives
      ? JSON.parse(config.zonesActives)
      : [];

    return NextResponse.json({
      fraisLivraison: parseFloat(config.fraisLivraison || "0"),
      minimumCommande: parseFloat(config.minimumCommande || "0"),
      zonesActives,
    });
  } catch (error) {
    console.error("GET_PUBLIC_DELIVERY_SETTINGS_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
