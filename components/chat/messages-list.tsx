"use client";

import React from "react";
import { Message } from "@/components/chat/message";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface MessagesListProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  streamingContent: string;
  onEditMessage: (messageId: string, newContent: string) => Promise<boolean>;
  onRegenerate: () => void;
}

export function MessagesList({
  messages,
  isStreaming,
  streamingContent,
  onEditMessage,
  onRegenerate,
}: MessagesListProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  if (messages.length === 0 && !isStreaming) {
    return null;
  }

  return (
    <ScrollArea className="flex-1 overflow-y-scroll" ref={scrollRef}>
      <div className="mx-auto max-w-3xl py-10">
        {messages.map((message, index) => {
          const lastAssistantIndex = messages.findLastIndex(
            (m) => m.role === "assistant",
          );
          const isLastAssistant =
            message.role === "assistant" && index === lastAssistantIndex;

          return (
            <Message
              key={message.id}
              messageId={message.id}
              role={message.role}
              content={message.content}
              onEdit={onEditMessage}
              isLastAssistant={isLastAssistant}
              onRegenerate={onRegenerate}
            />
          );
        })}

        {isStreaming && streamingContent && (
          <Message role="assistant" content={streamingContent} isStreaming />
        )}

        {isStreaming && !streamingContent && (
          <div className="px-4 py-3">
            <TypingIndicator />
          </div>
        )}

        <div ref={bottomRef} />
      </div>
      <div className="absolute top-0 to-background w-full h-10 bg-linear-to-t" />
      <div className="absolute bottom-0 from-background w-full h-10 bg-linear-to-t" />
    </ScrollArea>
  );
}
