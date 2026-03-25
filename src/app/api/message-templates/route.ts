import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";

// GET - List message templates
export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "";

  const templates = await prisma.messageTemplate.findMany({
    where: {
      userId,
      ...(category ? { category } : {}),
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ templates });
}

// POST - Create template
export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, content, category } = body;

    if (!name || !content) {
      return NextResponse.json({ error: "Thiếu tên hoặc nội dung" }, { status: 400 });
    }

    const template = await prisma.messageTemplate.create({
      data: {
        userId,
        name,
        content,
        category: category || null,
      },
    });

    return NextResponse.json({ message: "Tạo mẫu tin nhắn thành công", template });
  } catch (error) {
    console.error("Create template error:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi" }, { status: 500 });
  }
}

// PUT - Update template
export async function PUT(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, content, category } = body;

    if (!id) {
      return NextResponse.json({ error: "Thiếu ID" }, { status: 400 });
    }

    const existing = await prisma.messageTemplate.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Không tìm thấy mẫu" }, { status: 404 });
    }

    const template = await prisma.messageTemplate.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(content !== undefined && { content }),
        ...(category !== undefined && { category }),
      },
    });

    return NextResponse.json({ message: "Cập nhật thành công", template });
  } catch (error) {
    console.error("Update template error:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi" }, { status: 500 });
  }
}

// DELETE - Remove template
export async function DELETE(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const templateId = searchParams.get("id");

  if (!templateId) {
    return NextResponse.json({ error: "Thiếu ID" }, { status: 400 });
  }

  const template = await prisma.messageTemplate.findFirst({
    where: { id: templateId, userId },
  });

  if (!template) {
    return NextResponse.json({ error: "Không tìm thấy mẫu" }, { status: 404 });
  }

  await prisma.messageTemplate.delete({ where: { id: templateId } });

  return NextResponse.json({ message: "Đã xóa mẫu tin nhắn" });
}
