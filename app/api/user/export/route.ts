import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api";

/**
 * GET /api/user/export
 */
export const GET = withAuth(async (_request, user) => {
  try {
    const data = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        chats: {
          include: { messages: true },
        },
      },
    });

    return new Response(JSON.stringify(data, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="ai-bot-data-${Date.now()}.json"`,
      },
    });
  } catch (error) {
    console.error("Failed export data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
});
