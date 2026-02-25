import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api";

interface RouteParams {
  params: Promise<{ chatId: string }>;
}

/**
 * GET /api/chat/[chatId]
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { chatId } = await params;

  const handler = withAuth(async (_request, user) => {
    const chat = (await prisma.chat.findUnique({
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
    })) as {
      id: string;
      title: string | null;
      messages: {
        id: string;
        role: string;
        content: string;
        createdAt: Date;
      }[];
    } | null;

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
  });

  return handler(request);
}
