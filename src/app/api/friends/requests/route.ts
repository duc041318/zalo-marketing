import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";

// GET - List friend requests
export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const zaloAccountId = searchParams.get("accountId");
  const direction = searchParams.get("direction") || "";

  if (!zaloAccountId) {
    return NextResponse.json({ error: "Thiếu accountId" }, { status: 400 });
  }

  const requests = await prisma.friendRequest.findMany({
    where: {
      zaloAccountId,
      ...(direction ? { direction } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    accepted: requests.filter((r) => r.status === "accepted").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  return NextResponse.json({ requests, stats });
}

// PUT - Accept/reject friend request
export async function PUT(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { requestId, action } = body;

    if (!requestId || !["accept", "reject", "cancel"].includes(action)) {
      return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
    }

    const statusMap: Record<string, string> = {
      accept: "accepted",
      reject: "rejected",
      cancel: "cancelled",
    };

    const updated = await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: statusMap[action] },
    });

    const messages: Record<string, string> = {
      accept: "Đã chấp nhận lời mời",
      reject: "Đã từ chối lời mời",
      cancel: "Đã hủy lời mời",
    };

    return NextResponse.json({ message: messages[action], request: updated });
  } catch (error) {
    console.error("Update request error:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi" }, { status: 500 });
  }
}
