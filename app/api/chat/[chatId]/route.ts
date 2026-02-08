import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ chatId: string }>;
}

/**
 * GET /api/chat/[chatId]
 * Получить сообщения чата
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { chatId } = await params;
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const chat = await prisma.chat.findUnique({
      where: { id: chatId, userId: user.id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            role: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({
      chat: {
        id: chat.id,
        title: chat.title,
      },
      messages: chat.messages,
    });
  } catch (error) {
    console.error("Failed to fetch chat:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
