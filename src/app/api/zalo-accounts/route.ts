import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";

// GET - List all Zalo accounts for the user
export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const accounts = await prisma.zaloAccount.findMany({
    where: { userId },
    include: { proxy: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ accounts });
}

// POST - Add a new Zalo account
export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { zaloId, name, phone, cookie, token, proxyId } = body;

    if (!zaloId || !name) {
      return NextResponse.json(
        { error: "Vui lòng nhập Zalo ID và tên" },
        { status: 400 }
      );
    }

    // Check subscription limits
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    const accountCount = await prisma.zaloAccount.count({ where: { userId } });

    if (subscription && accountCount >= subscription.maxAccounts) {
      return NextResponse.json(
        { error: `Gói hiện tại chỉ cho phép ${subscription.maxAccounts} tài khoản` },
        { status: 403 }
      );
    }

    const account = await prisma.zaloAccount.create({
      data: {
        userId,
        zaloId,
        name,
        phone: phone || null,
        cookie: cookie || null,
        token: token || null,
        proxyId: proxyId || null,
        status: "active",
      },
    });

    return NextResponse.json({ message: "Thêm tài khoản thành công", account });
  } catch (error) {
    console.error("Add account error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a Zalo account
export async function DELETE(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get("id");

  if (!accountId) {
    return NextResponse.json({ error: "Thiếu ID tài khoản" }, { status: 400 });
  }

  const account = await prisma.zaloAccount.findFirst({
    where: { id: accountId, userId },
  });

  if (!account) {
    return NextResponse.json({ error: "Không tìm thấy tài khoản" }, { status: 404 });
  }

  await prisma.zaloAccount.delete({ where: { id: accountId } });

  return NextResponse.json({ message: "Đã xóa tài khoản" });
}
