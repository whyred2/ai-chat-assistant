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
  editMessage: (messageId: string, newContent: string) => Promise<boolean>;
  regenerateMessage: () => void;
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

  useEffect(() => {
    if (sessionId) {
      refreshChats();
    }
  }, [sessionId, refreshChats]);

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

  const editMessage = useCallback(
    async (messageId: string, newContent: string): Promise<boolean> => {
      if (!sessionId) return false;

      try {
        const res = await fetch("/api/chat/message", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Session-Id": sessionId,
          },
          body: JSON.stringify({ messageId, content: newContent }),
        });

        if (res.ok) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === messageId ? { ...m, content: newContent } : m,
            ),
          );
          return true;
        }
        return false;
      } catch (error) {
        console.error("Failed to edit message:", error);
        return false;
      }
    },
    [sessionId],
  );

  const clearCurrentChat = useCallback(() => {
    setCurrentChatId(null);
    setMessages([]);
    setStreamingContent("");
  }, []);

  const sendMessage = useCallback(
    async (message: string, model?: string): Promise<string | null> => {
      if (!sessionId || !message.trim()) return null;

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
        let realAssistantId: string | null = null;

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

                if (parsed.userMessageId) {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === userMessage.id
                        ? { ...m, id: parsed.userMessageId }
                        : m,
                    ),
                  );
                }

                if (parsed.assistantMessageId) {
                  realAssistantId = parsed.assistantMessageId;
                }

                if (parsed.content) {
                  fullContent += parsed.content;
                  setStreamingContent(fullContent);
                }
              } catch (e) {
                console.error("Failed to parse chunk:", e);
              }
            }
          }
        }

        if (fullContent) {
          const assistantMessage: ChatMessage = {
            id: realAssistantId || crypto.randomUUID(),
            role: "assistant",
            content: fullContent,
            createdAt: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }

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

  const regenerateMessage = useCallback(async () => {
    if (!sessionId || !currentChatId || isStreaming) return;

    const lastAssistantIndex = messages.findLastIndex(
      (m) => m.role === "assistant",
    );
    if (lastAssistantIndex === -1) return;

    const lastAssistantMessage = messages[lastAssistantIndex];

    const lastUserMessage = messages
      .slice(0, lastAssistantIndex)
      .findLast((m) => m.role === "user");
    if (!lastUserMessage) return;

    try {
      const deleteRes = await fetch("/api/chat/message", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": sessionId,
        },
        body: JSON.stringify({ messageId: lastAssistantMessage.id }),
      });

      if (!deleteRes.ok) {
        console.error("Failed to delete assistant message");
        return;
      }

      await fetch("/api/chat/message", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": sessionId,
        },
        body: JSON.stringify({ messageId: lastUserMessage.id }),
      });

      setMessages((prev) =>
        prev.filter(
          (m) =>
            m.id !== lastAssistantMessage.id && m.id !== lastUserMessage.id,
        ),
      );

      await sendMessage(lastUserMessage.content);
    } catch (error) {
      console.error("Failed to regenerate message:", error);
    }
  }, [sessionId, currentChatId, isStreaming, messages, sendMessage]);

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
        editMessage,
        regenerateMessage,
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
