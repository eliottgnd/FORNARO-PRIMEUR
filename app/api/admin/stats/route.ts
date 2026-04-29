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

export async function GET(request: Request) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    let orderWhere = {};
    if (dateParam) {
      const start = new Date(dateParam);
      start.setHours(0, 0, 0, 0);
      const end = new Date(dateParam);
      end.setHours(23, 59, 59, 999);
      orderWhere = { createdAt: { gte: start, lte: end } };
    }

    const totalRevenue = await prisma.order.aggregate({
      _sum: { total: true },
      where: orderWhere,
    });

    const totalOrders = await prisma.order.count({ where: orderWhere });

    const totalClients = await prisma.user.count();
    const totalProducts = await prisma.product.count();

    const recentOrders = await prisma.order.findMany({
      where: orderWhere,
      take: dateParam ? undefined : 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
      },
    });

    // For daily reports, derive top clients from the filtered orders
    let topClients;
    if (dateParam) {
      const ordersWithUsers = await prisma.order.findMany({
        where: orderWhere,
        include: { user: { select: { id: true, name: true, email: true } } },
      });
      const clientMap = new Map<string, { id: string; name: string | null; email: string; _count: { orders: number }; totalSpent: number }>();
      for (const order of ordersWithUsers) {
        const uid = order.userId;
        if (!clientMap.has(uid)) {
          clientMap.set(uid, { id: uid, name: order.user.name, email: order.user.email, _count: { orders: 0 }, totalSpent: 0 });
        }
        const c = clientMap.get(uid)!;
        c._count.orders++;
        c.totalSpent += order.total;
      }
      topClients = Array.from(clientMap.values())
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 5);
    } else {
      topClients = await prisma.user.findMany({
        take: 5,
        orderBy: { orders: { _count: "desc" } },
        include: { _count: { select: { orders: true } } },
      });
    }

    const categoryDistribution = await prisma.product.groupBy({
      by: ["category"],
      _count: { id: true },
    });

    const statusDistribution = await prisma.order.groupBy({
      by: ["status"],
      _count: { id: true },
      where: orderWhere,
    });

    return NextResponse.json({
      kpis: {
        revenue: totalRevenue._sum.total || 0,
        orders: totalOrders,
        clients: totalClients,
        products: totalProducts,
      },
      recentOrders,
      topClients,
      categoryDistribution,
      statusDistribution,
    });
  } catch (error) {
    console.error("GET_STATS_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
