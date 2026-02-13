import { prisma } from "@/lib/prisma";
import { mistral } from "@/lib/ai";
import { buildSystemPrompt } from "@/lib/prompts/system";
import { summarizeMessages } from "@/lib/prompts/summarize";
import { NextResponse } from "next/server";
import { withAuth, errorResponse } from "@/lib/api";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  message: string;
  chatId?: string;
  model?: string;
}

export const POST = withAuth(async (request, user) => {
  try {
    const body: ChatRequest = await request.json();
    const { message, chatId, model } = body;

    if (!message?.trim()) {
      return errorResponse("Message is required", 400);
    }

    let chat;
    if (chatId) {
      chat = await prisma.chat.findUnique({
        where: { id: chatId, userId: user.id },
      });
    }

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          userId: user.id,
          title: message.slice(0, 50) + (message.length > 50 ? "..." : ""),
          usePersona: user.usePersona,
        },
      });
    }

    const userMessage = await prisma.message.create({
      data: {
        chatId: chat.id,
        role: "user",
        content: message,
      },
    });

    const recentMessages = await prisma.message.findMany({
      where: { chatId: chat.id },
      orderBy: { createdAt: "desc" },
      take: user.messageHistoryLimit,
      select: { role: true, content: true },
    });
    recentMessages.reverse();

    const persona = chat.usePersona ? user.persona : null;
    const systemPrompt = buildSystemPrompt(persona, chat.summary);

    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...recentMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const selectedModel = model || user.preferredModel;

    console.log("selected model: ", selectedModel);

    const stream = await mistral.chat.stream({
      model: selectedModel,
      messages,
    });

    const encoder = new TextEncoder();
    let fullContent = "";

    const responseStream = new ReadableStream({
      async start(controller) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ chatId: chat.id, userMessageId: userMessage.id })}\n\n`,
          ),
        );

        try {
          for await (const event of stream) {
            const content = event.data.choices[0]?.delta?.content;
            if (content) {
              fullContent += content;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`),
              );
            }
          }

          if (fullContent) {
            const assistantMessage = await prisma.message.create({
              data: {
                chatId: chat.id,
                role: "assistant",
                content: fullContent,
              },
            });

            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ assistantMessageId: assistantMessage.id })}\n\n`,
              ),
            );

            if (user.enableSummarization) {
              const unsummarizedCount = await prisma.message.count({
                where: { chatId: chat.id, isSummarized: false },
              });

              if (unsummarizedCount > user.messageHistoryLimit) {
                const messagesToSummarize = await prisma.message.findMany({
                  where: { chatId: chat.id, isSummarized: false },
                  orderBy: { createdAt: "asc" },
                  take: unsummarizedCount - user.messageHistoryLimit,
                  select: { id: true, role: true, content: true },
                });

                try {
                  const summary = await summarizeMessages(
                    messagesToSummarize,
                    chat.summary,
                    selectedModel,
                  );

                  await prisma.$transaction([
                    prisma.chat.update({
                      where: { id: chat.id },
                      data: { summary },
                    }),
                    prisma.message.updateMany({
                      where: {
                        id: { in: messagesToSummarize.map((m) => m.id) },
                      },
                      data: { isSummarized: true },
                    }),
                  ]);
                } catch (error) {
                  console.error("Summarization failed:", error);
                }
              }
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (error) {
          console.error("Stream error:", error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return errorResponse("Internal server error", 500);
  }
});

export const DELETE = withAuth(async (request, user) => {
  try {
    const { chatId } = await request.json();

    if (!chatId) {
      return errorResponse("Chat ID is required", 400);
    }

    await prisma.chat.delete({
      where: { id: chatId, userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete chat: ", error);
    return errorResponse("Internal server error", 500);
  }
});

export const PATCH = withAuth(async (request, user) => {
  try {
    const { chatId, title } = await request.json();

    if (!chatId) {
      return errorResponse("Chat ID is required", 400);
    }

    await prisma.chat.update({
      where: { id: chatId },
      data: { title },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating chat:", error);
    return errorResponse("Internal server error", 500);
  }
});
