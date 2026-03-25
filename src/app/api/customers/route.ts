import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";

// GET - List customers (CRM)
export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  const customers = await prisma.customer.findMany({
    where: {
      userId,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { phone: { contains: search } },
            ],
          }
        : {}),
      ...(category ? { category } : {}),
    },
    orderBy: { updatedAt: "desc" },
  });

  const stats = {
    total: await prisma.customer.count({ where: { userId } }),
    hot: await prisma.customer.count({ where: { userId, category: "hot" } }),
    warm: await prisma.customer.count({ where: { userId, category: "warm" } }),
    cold: await prisma.customer.count({ where: { userId, category: "cold" } }),
  };

  return NextResponse.json({ customers, stats });
}

// POST - Add customer
export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, phone, zaloId, category, labels, notes } = body;

    if (!name) {
      return NextResponse.json({ error: "Thiếu tên khách hàng" }, { status: 400 });
    }

    const customer = await prisma.customer.create({
      data: {
        userId,
        name,
        phone: phone || null,
        zaloId: zaloId || null,
        category: category || "cold",
        labels: labels ? JSON.stringify(labels) : null,
        notes: notes || null,
      },
    });

    return NextResponse.json({ message: "Thêm khách hàng thành công", customer });
  } catch (error) {
    console.error("Add customer error:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi" }, { status: 500 });
  }
}

// PUT - Update customer
export async function PUT(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, phone, zaloId, category, labels, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Thiếu ID khách hàng" }, { status: 400 });
    }

    const existing = await prisma.customer.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Không tìm thấy khách hàng" }, { status: 404 });
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(zaloId !== undefined && { zaloId }),
        ...(category !== undefined && { category }),
        ...(labels !== undefined && { labels: JSON.stringify(labels) }),
        ...(notes !== undefined && { notes }),
        lastContact: new Date(),
      },
    });

    return NextResponse.json({ message: "Cập nhật thành công", customer });
  } catch (error) {
    console.error("Update customer error:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi" }, { status: 500 });
  }
}

// DELETE - Remove customer
export async function DELETE(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get("id");

  if (!customerId) {
    return NextResponse.json({ error: "Thiếu ID" }, { status: 400 });
  }

  const customer = await prisma.customer.findFirst({
    where: { id: customerId, userId },
  });

  if (!customer) {
    return NextResponse.json({ error: "Không tìm thấy khách hàng" }, { status: 404 });
  }

  await prisma.customer.delete({ where: { id: customerId } });

  return NextResponse.json({ message: "Đã xóa khách hàng" });
}
