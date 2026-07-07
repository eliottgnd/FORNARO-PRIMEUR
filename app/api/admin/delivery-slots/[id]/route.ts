import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function parseDeliveryDate(date: string) {
  const [year, month, day] = date.split("T")[0].split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user.role === "ADMIN";
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await checkAdmin()) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    const data: Record<string, unknown> = {};
    if (body.isActive !== undefined) data.isActive = body.isActive;
    if (body.maxCapacity !== undefined) data.maxCapacity = parseInt(body.maxCapacity);
    if (body.label !== undefined) data.label = body.label || null;
    if (body.date !== undefined) data.date = parseDeliveryDate(body.date);

    const slot = await prisma.deliverySlot.update({ where: { id }, data });
    return NextResponse.json(slot);
  } catch (error) {
    console.error("PATCH_ADMIN_SLOT_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await checkAdmin()) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    // Prevent deleting slots that have orders
    const booked = await prisma.order.count({
      where: { deliverySlotId: id, status: { not: "annulee" }, paymentStatus: { not: "echec" } },
    });
    if (booked > 0) {
      return NextResponse.json({ message: `Impossible de supprimer : ${booked} commande(s) sur ce créneau` }, { status: 400 });
    }

    await prisma.deliverySlot.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE_ADMIN_SLOT_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
