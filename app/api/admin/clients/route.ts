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
    if (!await checkAdmin()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const clients = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { email: "asc" },
    });

    // To provide the "total spent" which is required by the UI, we need to aggregate orders
    const clientsWithTotal = await Promise.all(
      clients.map(async (client) => {
        const orders = await prisma.order.findMany({
          where: { userId: client.id },
        });
        const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

        return {
          ...client,
          totalOrders: client._count.orders,
          totalSpent,
        };
      })
    );

    return NextResponse.json(clientsWithTotal);
  } catch (error) {
    console.error("GET_CLIENTS_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
