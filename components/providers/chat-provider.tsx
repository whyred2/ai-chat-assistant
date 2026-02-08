"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "./session-provider";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface ChatInfo {
  id: string;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatContextType {
  // Текущий чат
  currentChatId: string | null;
  messages: ChatMessage[];
  isStreaming: boolean;
  streamingContent: string;

  // Список чатов
  chats: ChatInfo[];
  isLoadingChats: boolean;

  // Действия
  sendMessage: (message: string, model?: string) => Promise<string | null>;
  loadChat: (chatId: string) => Promise<void>;
  clearCurrentChat: () => void;
  refreshChats: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { sessionId, user } = useSession();

  // Текущий чат
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");

  // Список чатов
  const [chats, setChats] = useState<ChatInfo[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);

  // Загрузка списка чатов
  const refreshChats = useCallback(async () => {
    if (!sessionId) return;

    setIsLoadingChats(true);
    try {
      const res = await fetch("/api/chats", {
        headers: { "X-Session-Id": sessionId },
      });

      if (res.ok) {
        const data = await res.json();
        setChats(data.chats);
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    } finally {
      setIsLoadingChats(false);
    }
  }, [sessionId]);

  // Загружаем чаты при инициализации
  useEffect(() => {
    if (sessionId) {
      refreshChats();
    }
  }, [sessionId, refreshChats]);

  // Загрузка конкретного чата
  const loadChat = useCallback(
    async (chatId: string) => {
      if (!sessionId) return;

      try {
        const res = await fetch(`/api/chat/${chatId}`, {
          headers: { "X-Session-Id": sessionId },
        });

        if (res.ok) {
          const data = await res.json();
          setCurrentChatId(chatId);
          setMessages(
            data.messages.map((m: ChatMessage) => ({
              ...m,
              createdAt: new Date(m.createdAt),
            })),
          );
        }
      } catch (error) {
        console.error("Failed to load chat:", error);
      }
    },
    [sessionId],
  );

  // Очистка текущего чата (для новых чатов)
  const clearCurrentChat = useCallback(() => {
    setCurrentChatId(null);
    setMessages([]);
    setStreamingContent("");
  }, []);

  // Отправка сообщения
  const sendMessage = useCallback(
    async (message: string, model?: string): Promise<string | null> => {
      if (!sessionId || !message.trim()) return null;

      // Добавляем сообщение пользователя локально
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: message,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsStreaming(true);
      setStreamingContent("");

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Session-Id": sessionId,
          },
          body: JSON.stringify({
            message,
            chatId: currentChatId,
            model: model || user?.preferredModel,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to send message");
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let fullContent = "";
        let newChatId: string | null = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);

                if (parsed.chatId && !newChatId) {
                  newChatId = parsed.chatId;
                  setCurrentChatId(parsed.chatId);
                }

                if (parsed.content) {
                  fullContent += parsed.content;
                  setStreamingContent(fullContent);
                }
              } catch {
                // Пропускаем невалидный JSON
              }
            }
          }
        }

        // Добавляем полное сообщение ассистента
        if (fullContent) {
          const assistantMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: fullContent,
            createdAt: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }

        // Обновляем список чатов
        await refreshChats();

        return newChatId || currentChatId;
      } catch (error) {
        console.error("Failed to send message:", error);
        return null;
      } finally {
        setIsStreaming(false);
        setStreamingContent("");
      }
    },
    [sessionId, currentChatId, user?.preferredModel, refreshChats],
  );

  return (
    <ChatContext.Provider
      value={{
        currentChatId,
        messages,
        isStreaming,
        streamingContent,
        chats,
        isLoadingChats,
        sendMessage,
        loadChat,
        clearCurrentChat,
        refreshChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
