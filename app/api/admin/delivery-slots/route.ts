import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };

function parseDeliveryDate(date: string) {
  const [year, month, day] = date.split("T")[0].split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user.role === "ADMIN";
}

export async function GET() {
  try {
    if (!await checkAdmin()) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const slots = await prisma.deliverySlot.findMany({
      orderBy: { date: "asc" },
      include: {
        _count: {
          select: {
            orders: {
              where: { status: { not: "annulee" }, paymentStatus: { not: "echec" } },
            },
          },
        },
      },
    });

    return NextResponse.json(
      slots.map((s) => ({
        id: s.id,
        date: s.date,
        label: s.label,
        maxCapacity: s.maxCapacity,
        isActive: s.isActive,
        booked: s._count.orders,
        remaining: s.maxCapacity - s._count.orders,
      })),
      { headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("GET_ADMIN_SLOTS_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!await checkAdmin()) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { date, label, maxCapacity } = await req.json();

    if (!date || !maxCapacity) {
      return NextResponse.json({ message: "Date et capacité requis" }, { status: 400 });
    }

    const slot = await prisma.deliverySlot.create({
      data: {
        date: parseDeliveryDate(date),
        label: label || null,
        maxCapacity: parseInt(maxCapacity),
      },
    });

    return NextResponse.json(slot, { status: 201 });
  } catch (error) {
    console.error("POST_ADMIN_SLOT_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
