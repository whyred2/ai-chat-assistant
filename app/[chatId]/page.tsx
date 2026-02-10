"use client";

import { useEffect, use } from "react";
import { Header } from "@/components/chat/header";
import { ChatInputArea } from "@/components/chat/input-area";
import { MessagesList } from "@/components/chat/messages-list";
import { useChat } from "@/components/providers/chat-provider";

interface ChatPageProps {
  params: Promise<{ chatId: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const { chatId } = use(params);
  const {
    messages,
    isStreaming,
    streamingContent,
    loadChat,
    sendMessage,
    currentChatId,
    editMessage,
  } = useChat();

  // Загружаем чат при входе
  useEffect(() => {
    if (chatId && chatId !== currentChatId) {
      loadChat(chatId);
    }
  }, [chatId, currentChatId, loadChat]);

  const handleSendMessage = async (message: string) => {
    await sendMessage(message);
  };

  return (
    <div className=" bg-background relative flex h-full w-full flex-col">
      <Header />

      <MessagesList
        messages={messages}
        isStreaming={isStreaming}
        streamingContent={streamingContent}
        onEditMessage={editMessage}
      />

      <ChatInputArea
        onSendMessage={handleSendMessage}
        isEmptyChat={messages.length === 0}
        isStreaming={isStreaming}
      />
    </div>
  );
}
