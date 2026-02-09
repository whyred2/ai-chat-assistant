import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/user/ai-settings
 * Получить AI настройки пользователя
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
      select: {
        enableSummarization: true,
        messageHistoryLimit: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to get AI settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/user/ai-settings
 * Обновить AI настройки пользователя
 */
export async function POST(request: NextRequest) {
  const sessionId = request.headers.get("X-Session-Id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    const { enableSummarization, messageHistoryLimit } = body;

    // Формируем объект обновления
    const updateData: {
      enableSummarization?: boolean;
      messageHistoryLimit?: number;
    } = {};

    if (enableSummarization !== undefined) {
      updateData.enableSummarization = enableSummarization;
    }

    if (messageHistoryLimit !== undefined) {
      // Валидация лимита
      const limit = Math.min(Math.max(Number(messageHistoryLimit), 10), 100);
      updateData.messageHistoryLimit = limit;
    }

    const user = await prisma.user.update({
      where: { sessionId },
      data: updateData,
      select: {
        enableSummarization: true,
        messageHistoryLimit: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to update AI settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
