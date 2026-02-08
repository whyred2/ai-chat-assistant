"use client";

import { useRef, useEffect, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSession } from "@/components/providers/session-provider";

interface ChatInputAreaProps {
  onSendMessage: (message: string) => void;
  isEmptyChat: boolean;
  isStreaming?: boolean;
}

export function ChatInputArea({
  onSendMessage,
  isEmptyChat,
  isStreaming = false,
}: ChatInputAreaProps) {
  const isMobile = useIsMobile();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaContainerRef = useRef<HTMLDivElement>(null);

  const { user, isLoading } = useSession();
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  // Character limit for warning
  const MAX_CHARS = 1000;
  const WARNING_THRESHOLD = 800;

  // Используем выбранную модель или preferredModel пользователя
  const currentModel =
    selectedModel || user?.preferredModel || "mistral-small-latest";

  // Обновление высоты textarea контейнера через CSS-переменную
  useEffect(() => {
    let rafId: number | null = null;

    const updateHeight = () => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const container = textareaContainerRef.current;
        if (container) {
          const height = container.offsetHeight;
          const root = document.documentElement as HTMLElement;
          root.style.setProperty("--textarea-height", `${height}px`);
        }
      });
    };

    const resizeObserver = new ResizeObserver(updateHeight);
    if (textareaContainerRef.current) {
      resizeObserver.observe(textareaContainerRef.current);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
    };
  }, []);

  const handleContainerClick = () => {
    textareaRef.current?.focus();
  };

  const handleSend = () => {
    if (!input.trim() || isStreaming || isLoading) return;

    onSendMessage(input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isMobile) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    // TODO: можно сохранять в БД через API
  };

  return (
    <div className="pointer-events-none absolute bottom-0 w-full flex-none px-2 pb-2">
      {/* Поле сообщения */}
      <div
        ref={textareaContainerRef}
        className={cn(
          isEmptyChat ? "-translate-y-[30vh]" : "translate-y-0",
          "pointer-events-auto relative mx-auto flex max-w-3xl transition-[translate] duration-800 ease-in-out",
        )}
      >
        <div
          onClick={handleContainerClick}
          className={cn(
            "rounded-2xl",
            "click-focus-input bg-card relative flex w-full flex-col p-3 shadow-xl transition-colors duration-300 ease-in-out hover:cursor-text max-sm:p-2",
          )}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={
              isMobile
                ? "Message..."
                : "Press Enter to send, Shift+Enter for new line"
            }
            disabled={isLoading || isStreaming}
            className={cn(
              "relative mb-4 max-h-40 w-full resize-none overflow-y-auto",
              "flex field-sizing-content w-full bg-transparent outline-none",
            )}
          />

          <div className="click-focus-input flex w-full max-w-full items-center justify-between max-sm:gap-1">
            <div className="flex items-center gap-2">
              <Select value={currentModel} onValueChange={handleModelChange}>
                <SelectTrigger className="h-8! rounded-lg text-xs sm:h-9! sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  <SelectItem value="ministral-14b-latest">
                    Ministral 14B
                  </SelectItem>
                  <SelectItem value="mistral-medium">Mistral Medium</SelectItem>
                  <SelectItem value="mistral-small-latest">
                    Mistral Small
                  </SelectItem>
                  <SelectItem value="labs-mistral-small-creative">
                    Small Creative
                  </SelectItem>
                </SelectContent>
              </Select>
              {/* Character counter */}
              {input.length > 0 && (
                <span
                  className={cn(
                    "hidden text-xs tabular-nums transition-colors sm:block",
                    input.length > MAX_CHARS
                      ? "text-destructive font-medium"
                      : input.length > WARNING_THRESHOLD
                        ? "text-yellow-500"
                        : "text-muted-foreground",
                  )}
                  title={
                    input.length > MAX_CHARS
                      ? "Message too long"
                      : input.length > WARNING_THRESHOLD
                        ? "Message almost too long"
                        : "Character count"
                  }
                >
                  {input.length}/{MAX_CHARS}
                </span>
              )}
            </div>

            <Button
              onClick={handleSend}
              disabled={
                isLoading ||
                isStreaming ||
                !input.trim() ||
                input.length > MAX_CHARS
              }
              size="icon"
              className="size-8 sm:size-9"
              title="Send"
            >
              <SendHorizontal className="size-4 sm:size-4.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
