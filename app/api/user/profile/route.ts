import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/user/profile
 * Получить профиль пользователя
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
        id: true,
        name: true,
        persona: true,
        enableSummarization: true,
        messageHistoryLimit: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to get user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/user/profile
 * Обновить профиль пользователя (включая persona)
 */
export async function PATCH(request: NextRequest) {
  const sessionId = request.headers.get("X-Session-Id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    const { name, persona } = body;

    // Формируем объект обновления
    const updateData: { name?: string; persona?: string | null } = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (persona !== undefined) {
      updateData.persona = persona || null;
    }

    const user = await prisma.user.update({
      where: { sessionId },
      data: updateData,
      select: {
        id: true,
        name: true,
        persona: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to update user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
