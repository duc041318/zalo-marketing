import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";

// GET - List messages
export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "";
  const status = searchParams.get("status") || "";

  const messages = await prisma.message.findMany({
    where: {
      userId,
      ...(type ? { type } : {}),
      ...(status ? { status } : {}),
    },
    include: { zaloAccount: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ messages });
}

// POST - Create and send message
export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { zaloAccountId, type, content, recipients, scheduledAt } = body;

    if (!zaloAccountId || !type || !content) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        userId,
        zaloAccountId,
        type,
        content,
        recipients: recipients ? JSON.stringify(recipients) : null,
        status: scheduledAt ? "pending" : "sending",
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      },
    });

    // Create a job for sending
    await prisma.job.create({
      data: {
        userId,
        zaloAccountId,
        type: "send_message",
        status: scheduledAt ? "pending" : "running",
        total: Array.isArray(recipients) ? recipients.length : 1,
        result: JSON.stringify({ messageId: message.id }),
      },
    });

    return NextResponse.json({
      message: scheduledAt ? "Đã đặt lịch gửi tin" : "Đang gửi tin nhắn",
      data: message,
    });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi" }, { status: 500 });
  }
}
