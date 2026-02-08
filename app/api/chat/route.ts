import { prisma } from "@/lib/prisma";
import { mistral } from "@/lib/ai";
import { buildSystemPrompt } from "@/lib/prompts/system";
import { NextRequest } from "next/server";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  message: string;
  chatId?: string;
  model?: string;
}

export async function POST(request: NextRequest) {
  const sessionId = request.headers.get("X-Session-Id");

  if (!sessionId) {
    return new Response(JSON.stringify({ error: "Session ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body: ChatRequest = await request.json();
    const { message, chatId, model = "mistral-small-latest" } = body;

    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Получаем пользователя
    const user = await prisma.user.findUnique({
      where: { sessionId },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Создаём или получаем чат
    let chat;
    if (chatId) {
      chat = await prisma.chat.findUnique({
        where: { id: chatId, userId: user.id },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });
    }

    if (!chat) {
      // Создаём новый чат
      chat = await prisma.chat.create({
        data: {
          userId: user.id,
          title: message.slice(0, 50) + (message.length > 50 ? "..." : ""),
        },
        include: { messages: true },
      });
    }

    // Сохраняем сообщение пользователя
    await prisma.message.create({
      data: {
        chatId: chat.id,
        role: "user",
        content: message,
      },
    });

    // Формируем историю сообщений для API
    const systemPrompt = buildSystemPrompt(
      chat.usePersona ? user.persona : null,
    );

    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...chat.messages.slice(-user.messageHistoryLimit).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    // Вызываем Mistral API со стримингом
    const stream = await mistral.chat.stream({
      model,
      messages,
    });

    // Создаём стрим для клиента
    const encoder = new TextEncoder();
    let fullContent = "";

    const responseStream = new ReadableStream({
      async start(controller) {
        // Отправляем chatId в начале
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ chatId: chat.id })}\n\n`),
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

          // Сохраняем полный ответ ассистента
          if (fullContent) {
            await prisma.message.create({
              data: {
                chatId: chat.id,
                role: "assistant",
                content: fullContent,
              },
            });
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
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
