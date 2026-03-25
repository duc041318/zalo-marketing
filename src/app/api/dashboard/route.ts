import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";

// GET - Dashboard stats
export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const [
    accounts,
    totalFriends,
    totalGroups,
    totalMessages,
    totalCustomers,
    runningJobs,
    completedJobs,
    subscription,
    recentJobs,
  ] = await Promise.all([
    prisma.zaloAccount.count({ where: { userId } }),
    prisma.zaloAccount.aggregate({
      where: { userId },
      _sum: { friends: true },
    }),
    prisma.zaloAccount.aggregate({
      where: { userId },
      _sum: { groups: true },
    }),
    prisma.message.count({ where: { userId } }),
    prisma.customer.count({ where: { userId } }),
    prisma.job.count({ where: { userId, status: "running" } }),
    prisma.job.count({ where: { userId, status: "completed" } }),
    prisma.subscription.findUnique({ where: { userId } }),
    prisma.job.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { zaloAccount: { select: { name: true } } },
    }),
  ]);

  return NextResponse.json({
    stats: {
      accounts,
      friends: totalFriends._sum.friends || 0,
      groups: totalGroups._sum.groups || 0,
      messages: totalMessages,
      customers: totalCustomers,
      runningJobs,
      completedJobs,
    },
    subscription,
    recentJobs,
  });
}
