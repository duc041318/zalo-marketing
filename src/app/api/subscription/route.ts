import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";

// GET - Get current subscription
export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  const stats = {
    accounts: await prisma.zaloAccount.count({ where: { userId } }),
    runningJobs: await prisma.job.count({ where: { userId, status: "running" } }),
  };

  return NextResponse.json({ subscription, stats });
}

// POST - Upgrade subscription
export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { plan, duration, method, licenseKey } = body;

    const planConfig: Record<string, { maxAccounts: number; maxDevices: number; maxJobs: number }> = {
      starter: { maxAccounts: 3, maxDevices: 1, maxJobs: 5 },
      pro: { maxAccounts: 10, maxDevices: 3, maxJobs: 50 },
      business: { maxAccounts: 25, maxDevices: 5, maxJobs: 200 },
    };

    const durationDays: Record<string, number> = {
      "1_month": 30,
      "3_months": 90,
      "6_months": 180,
      "1_year": 365,
    };

    if (!planConfig[plan]) {
      return NextResponse.json({ error: "Gói không hợp lệ" }, { status: 400 });
    }

    const config = planConfig[plan];
    const days = durationDays[duration] || 30;

    // Update subscription
    const subscription = await prisma.subscription.upsert({
      where: { userId },
      update: {
        plan,
        maxAccounts: config.maxAccounts,
        maxDevices: config.maxDevices,
        maxJobs: config.maxJobs,
        endDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      },
      create: {
        userId,
        plan,
        maxAccounts: config.maxAccounts,
        maxDevices: config.maxDevices,
        maxJobs: config.maxJobs,
        endDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      },
    });

    // Record payment
    await prisma.payment.create({
      data: {
        userId,
        amount: 0, // Would be calculated from plan + duration
        method: method || "license_key",
        plan,
        duration,
        status: "completed",
        reference: licenseKey || null,
      },
    });

    return NextResponse.json({
      message: "Nâng cấp thành công",
      subscription,
    });
  } catch (error) {
    console.error("Upgrade error:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi" }, { status: 500 });
  }
}
