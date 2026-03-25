import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";

// GET - List proxies
export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const proxies = await prisma.proxy.findMany({
    where: { userId },
    include: { zaloAccounts: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ proxies });
}

// POST - Add proxy
export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { host, port, type, username, password } = body;

    if (!host || !port) {
      return NextResponse.json({ error: "Thiếu host hoặc port" }, { status: 400 });
    }

    const proxy = await prisma.proxy.create({
      data: {
        userId,
        host,
        port: parseInt(port),
        type: type || "http",
        username: username || null,
        password: password || null,
      },
    });

    return NextResponse.json({ message: "Thêm proxy thành công", proxy });
  } catch (error) {
    console.error("Add proxy error:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi" }, { status: 500 });
  }
}

// DELETE - Remove proxy
export async function DELETE(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const proxyId = searchParams.get("id");

  if (!proxyId) {
    return NextResponse.json({ error: "Thiếu ID proxy" }, { status: 400 });
  }

  const proxy = await prisma.proxy.findFirst({
    where: { id: proxyId, userId },
  });

  if (!proxy) {
    return NextResponse.json({ error: "Không tìm thấy proxy" }, { status: 404 });
  }

  await prisma.proxy.delete({ where: { id: proxyId } });

  return NextResponse.json({ message: "Đã xóa proxy" });
}
