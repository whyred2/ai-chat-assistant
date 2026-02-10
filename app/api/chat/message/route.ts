import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const sessionId = request.headers.get("X-Session-Id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 },
    );
  }

  try {
    const { messageId, content } = await request.json();

    if (!messageId || !content?.trim()) {
      return NextResponse.json(
        { error: "Message ID and content are required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { sessionId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify the message belongs to a chat owned by this user
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
}
