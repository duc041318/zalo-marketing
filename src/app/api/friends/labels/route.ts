import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";

// PUT - Update labels for friends (bulk)
export async function PUT(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { friendIds, labels } = body;

    if (!friendIds || !Array.isArray(friendIds) || friendIds.length === 0) {
      return NextResponse.json({ error: "Chưa chọn bạn bè" }, { status: 400 });
    }

    const labelsJson = JSON.stringify(labels || []);

    await prisma.friend.updateMany({
      where: { id: { in: friendIds } },
      data: { labels: labelsJson },
    });

    return NextResponse.json({
      message: `Đã gắn nhãn cho ${friendIds.length} bạn bè`,
    });
  } catch (error) {
    console.error("Update labels error:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi" }, { status: 500 });
  }
}
