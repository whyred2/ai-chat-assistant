"use client";

import React from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "@/components/providers/session-provider";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatInputAreaProps {
  onSendMessage: (message: string, model?: string) => void;
  isEmptyChat: boolean;
  isStreaming?: boolean;
}

export function ChatInputArea({
  onSendMessage,
  isEmptyChat,
  isStreaming = false,
}: ChatInputAreaProps) {
  const isMobile = useIsMobile();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const textareaContainerRef = React.useRef<HTMLDivElement>(null);

  const { user, isLoading, sessionId } = useSession();
  const [input, setInput] = React.useState<string>("");
  const [selectedModel, setSelectedModel] = React.useState<string | null>(null);

  const MAX_CHARS = 1000;
  const WARNING_THRESHOLD = 800;

  const currentModel =
    selectedModel || user?.preferredModel || "mistral-small-latest";

  const handleContainerClick = () => {
    textareaRef.current?.focus();
  };

  const handleSend = () => {
    if (!input.trim() || isStreaming || isLoading || input.length > MAX_CHARS)
      return;

    onSendMessage(input, currentModel);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isMobile) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleModelChange = async (model: string) => {
    if (!sessionId) return;

    const response = await fetch("/api/user/ai-settings", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Session-Id": sessionId,
      },
      body: JSON.stringify(model),
    });

    if (response.ok) {
      console.log("Model switched. New model:", model);
      setSelectedModel(model);
    } else {
      console.error("Error switching model.");
    }
  };

  return (
    <div className="pointer-events-none w-full flex-none pb-2 px-2">
      {/* Поле сообщения */}
      <div
        ref={textareaContainerRef}
        className="pointer-events-auto relative mx-auto flex max-w-3xl"
      >
        <div
          onClick={handleContainerClick}
          className="rounded-2xl click-focus-input bg-card relative flex w-full flex-col p-3 shadow-xl transition-colors duration-300 ease-in-out hover:cursor-text max-sm:p-2"
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
                  <SelectItem value="mistral-medium">Mistral Medium</SelectItem>
                  <SelectItem value="mistral-small-latest">
                    Mistral Small
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
