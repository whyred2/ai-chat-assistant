"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/chat/header";
import { ChatInputArea } from "@/components/chat/input-area";
import { useChat } from "@/components/providers/chat-provider";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { clearCurrentChat, sendMessage, isStreaming } = useChat();

  useEffect(() => {
    clearCurrentChat();
  }, [clearCurrentChat]);

  const handleSendMessage = async (message: string, model?: string) => {
    const chatId = await sendMessage(message, model);
    if (chatId) {
      router.push(`/${chatId}`);
    }
  };

  return (
    <div className="bg-background relative flex h-full w-full flex-col">
      <Header />

      <div className="flex-1 items-center justify-center"></div>

      <ChatInputArea
        onSendMessage={handleSendMessage}
        isEmptyChat={true}
        isStreaming={isStreaming}
      />
    </div>
  );
}
