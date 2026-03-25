import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";

// GET - List groups for a Zalo account
export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const zaloAccountId = searchParams.get("accountId");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  if (!zaloAccountId) {
    return NextResponse.json({ error: "Thiếu accountId" }, { status: 400 });
  }

  const account = await prisma.zaloAccount.findFirst({
    where: { id: zaloAccountId, userId },
  });

  if (!account) {
    return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 });
  }

  const groups = await prisma.zaloGroup.findMany({
    where: {
      zaloAccountId,
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
      ...(category ? { category } : {}),
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ groups, total: groups.length });
}

// POST - Add/join a group
export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { zaloAccountId, groupZaloId, name, link, category } = body;

    if (!zaloAccountId || !groupZaloId || !name) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    const group = await prisma.zaloGroup.upsert({
      where: {
        zaloAccountId_groupZaloId: { zaloAccountId, groupZaloId },
      },
      update: { name, link, category },
      create: {
        zaloAccountId,
        groupZaloId,
        name,
        link: link || null,
        category: category || null,
      },
    });

    return NextResponse.json({ message: "Đã thêm nhóm", group });
  } catch (error) {
    console.error("Add group error:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi" }, { status: 500 });
  }
}

// DELETE - Leave/remove a group
export async function DELETE(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get("id");

  if (!groupId) {
    return NextResponse.json({ error: "Thiếu ID nhóm" }, { status: 400 });
  }

  const group = await prisma.zaloGroup.findFirst({
    where: { id: groupId },
    include: { zaloAccount: { select: { userId: true } } },
  });

  if (!group || group.zaloAccount.userId !== userId) {
    return NextResponse.json({ error: "Không tìm thấy nhóm" }, { status: 404 });
  }

  await prisma.zaloGroup.delete({ where: { id: groupId } });

  return NextResponse.json({ message: "Đã rời nhóm" });
}
