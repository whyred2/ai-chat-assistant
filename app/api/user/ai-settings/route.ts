import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { errorResponse, withAuth } from "@/lib/api";

/**
 * GET /api/user/ai-settings
 */
export const GET = withAuth(async (_request, user) => {
  try {
    const settings = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        enableSummarization: true,
        messageHistoryLimit: true,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to get AI settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
});

/**
 * POST /api/user/ai-settings
 */
export const POST = withAuth(async (request, user) => {
  try {
    const body = await request.json();
    const { enableSummarization, messageHistoryLimit } = body;

    const updateData: {
      enableSummarization?: boolean;
      messageHistoryLimit?: number;
    } = {};

    if (enableSummarization !== undefined) {
      updateData.enableSummarization = enableSummarization;
    }

    if (messageHistoryLimit !== undefined) {
      const limit = Math.min(Math.max(Number(messageHistoryLimit), 10), 30);
      updateData.messageHistoryLimit = limit;
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        enableSummarization: true,
        messageHistoryLimit: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update AI settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
});

/**
 * PATCH /api/user/ai-settings
 */
export const PATCH = withAuth(async (request, user) => {
  const model = await request.json();
  console.log(model);
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { preferredModel: model },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse("Internal server error", 500);
  }
});
