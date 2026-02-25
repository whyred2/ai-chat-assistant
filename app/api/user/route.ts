import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/user
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
    const user = await prisma.user.upsert({
      where: { sessionId },
      create: { sessionId },
      update: {},
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Failed to get/create user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
