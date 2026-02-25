import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withAuth, errorResponse } from "@/lib/api";

export const PUT = withAuth(async (request, user) => {
  try {
    const { messageId, content } = await request.json();

    if (!messageId || !content?.trim()) {
      return NextResponse.json(
        { error: "Message ID and content are required" },
        { status: 400 },
      );
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { chat: { select: { userId: true } } },
    });

    if (!message || message.chat.userId !== user.id) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    await prisma.message.update({
      where: { id: messageId },
      data: { content: content.trim() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
});

export const DELETE = withAuth(async (request, user) => {
  try {
    const { messageId } = await request.json();

    if (!messageId) {
      return errorResponse("Message ID is required", 400);
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { chat: { select: { userId: true } } },
    });

    if (!message || message.chat.userId !== user.id) {
      return errorResponse("Message not found", 404);
    }

    await prisma.message.delete({
      where: { id: messageId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting message:", error);
    return errorResponse("Internal server error", 500);
  }
});
