import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";

// GET - List jobs
export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "";

  const jobs = await prisma.job.findMany({
    where: {
      userId,
      ...(status ? { status } : {}),
    },
    include: {
      zaloAccount: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Stats
  const stats = {
    total: await prisma.job.count({ where: { userId } }),
    running: await prisma.job.count({ where: { userId, status: "running" } }),
    completed: await prisma.job.count({ where: { userId, status: "completed" } }),
    failed: await prisma.job.count({ where: { userId, status: "failed" } }),
  };

  return NextResponse.json({ jobs, stats });
}
