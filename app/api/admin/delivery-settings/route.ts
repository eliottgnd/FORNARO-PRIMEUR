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

export async function GET() {
  try {
    const settings = await prisma.globalSetting.findMany();

    // Transform array to object for easier consumption: { key: value }
    const config = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(config);
  } catch (error) {
    console.error("GET_DELIVERY_SETTINGS_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    // Body expected as { key: value }
    const settings = Object.entries(body);

    const updates = settings.map(async ([key, value]) => {
      return prisma.globalSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    });

    await Promise.all(updates);

    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("PUT_DELIVERY_SETTINGS_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
