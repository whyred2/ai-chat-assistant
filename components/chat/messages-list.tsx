"use client";

import { useEffect, useRef } from "react";
import { Message } from "./message";
import { TypingIndicator } from "./typing-indicator";
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
}

export function MessagesList({
  messages,
  isStreaming,
  streamingContent,
}: MessagesListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Автоскролл при новых сообщениях
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  if (messages.length === 0 && !isStreaming) {
    return null;
  }

  return (
    <ScrollArea className="flex-1" ref={scrollRef}>
      <div className="mx-auto max-w-3xl py-4">
        {messages.map((message) => (
          <Message
            key={message.id}
            role={message.role}
            content={message.content}
          />
        ))}

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
    </ScrollArea>
  );
}
