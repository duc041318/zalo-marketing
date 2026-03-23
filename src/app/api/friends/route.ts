import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";

// GET - List friends for a Zalo account
export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const zaloAccountId = searchParams.get("accountId");
  const search = searchParams.get("search") || "";
  const label = searchParams.get("label") || "";

  if (!zaloAccountId) {
    return NextResponse.json({ error: "Thiếu accountId" }, { status: 400 });
  }

  // Verify ownership
  const account = await prisma.zaloAccount.findFirst({
    where: { id: zaloAccountId, userId },
  });

  if (!account) {
    return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 });
  }

  const friends = await prisma.friend.findMany({
    where: {
      zaloAccountId,
      ...(search ? { name: { contains: search } } : {}),
      ...(label ? { labels: { contains: label } } : {}),
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ friends, total: friends.length });
}

// POST - Add friend request
export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { zaloAccountId, targetZaloId, targetName } = body;

    const friendRequest = await prisma.friendRequest.create({
      data: {
        zaloAccountId,
        targetZaloId,
        targetName: targetName || null,
        status: "pending",
        direction: "outgoing",
      },
    });

    return NextResponse.json({ message: "Đã gửi lời mời kết bạn", friendRequest });
  } catch (error) {
    console.error("Add friend error:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi" }, { status: 500 });
  }
}
