"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/chat/header";
import { ChatInputArea } from "@/components/chat/input-area";
import { useChat } from "@/components/providers/chat-provider";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { clearCurrentChat, sendMessage, isStreaming, messages } = useChat();

  // Очищаем чат при входе на главную
  useEffect(() => {
    clearCurrentChat();
  }, [clearCurrentChat]);

  const handleSendMessage = async (message: string) => {
    const chatId = await sendMessage(message);
    if (chatId) {
      router.push(`/${chatId}`);
    }
  };

  return (
    <div className="bg-background relative flex h-full w-full flex-col">
      <Header />

      {/* Welcome message */}
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Hello! 👋</h1>
        </div>
      </div>

      <ChatInputArea
        onSendMessage={handleSendMessage}
        isEmptyChat={true}
        isStreaming={isStreaming}
      />
    </div>
  );
}
