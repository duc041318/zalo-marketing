import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";

// GET - Get affiliate info
export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  let affiliate = await prisma.affiliate.findUnique({
    where: { userId },
    include: {
      referrals: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  // Auto-create affiliate if not exists
  if (!affiliate) {
    const code = `ZM${userId.slice(-6).toUpperCase()}${Math.random().toString(36).slice(-4).toUpperCase()}`;
    affiliate = await prisma.affiliate.create({
      data: {
        userId,
        referralCode: code,
      },
      include: {
        referrals: true,
      },
    });
  }

  return NextResponse.json({ affiliate });
}

// POST - Request withdrawal
export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { amount } = body;

    const affiliate = await prisma.affiliate.findUnique({
      where: { userId },
    });

    if (!affiliate) {
      return NextResponse.json({ error: "Chưa tham gia affiliate" }, { status: 400 });
    }

    const available = affiliate.commission - affiliate.withdrawn;
    if (!amount || amount > available) {
      return NextResponse.json(
        { error: `Số dư khả dụng: ${available.toLocaleString()}đ` },
        { status: 400 }
      );
    }

    if (amount < 100000) {
      return NextResponse.json(
        { error: "Số tiền rút tối thiểu là 100,000đ" },
        { status: 400 }
      );
    }

    await prisma.affiliate.update({
      where: { userId },
      data: { withdrawn: { increment: amount } },
    });

    return NextResponse.json({ message: "Yêu cầu rút tiền đã được ghi nhận" });
  } catch (error) {
    console.error("Withdrawal error:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi" }, { status: 500 });
  }
}
