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

    // 1. Total Revenue
    const totalRevenue = await prisma.order.aggregate({
      _sum: { total: true },
    });

    // 2. Total Orders
    const totalOrders = await prisma.order.count();

    // 3. Total Clients
    const totalClients = await prisma.user.count();

    // 4. Total Products
    const totalProducts = await prisma.product.count();

    // 5. Recent Orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
      },
    });

    // 6. Top Clients
    const topClients = await prisma.user.findMany({
      take: 5,
      orderBy: {
        orders: {
          _count: 'desc'
        }
      },
      include: {
        _count: { select: { orders: true } }
      }
    });

    // 7. Category Distribution
    const categoryDistribution = await prisma.product.groupBy({
      by: ['category'],
      _count: { id: true }
    });

    // 8. Order Status Distribution
    const statusDistribution = await prisma.order.groupBy({
      by: ['status'],
      _count: { id: true }
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
