import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/chats
 * Получить список чатов пользователя
 */
export async function GET(request: NextRequest) {
  const sessionId = request.headers.get("X-Session-Id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { sessionId },
    });

    if (!user) {
      return NextResponse.json({ chats: [] });
    }

    const chats = await prisma.chat.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ chats });
  } catch (error) {
    console.error("Failed to fetch chats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
