import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth/prisma";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };

export async function GET() {
  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const slots = await prisma.deliverySlot.findMany({
      where: { isActive: true, date: { gte: now } },
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

    const result = slots.map((slot) => ({
      id: slot.id,
      date: slot.date,
      label: slot.label,
      maxCapacity: slot.maxCapacity,
      booked: slot._count.orders,
      remaining: slot.maxCapacity - slot._count.orders,
    })).filter((s) => s.remaining > 0);

    return NextResponse.json(result, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error("GET_DELIVERY_SLOTS_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
