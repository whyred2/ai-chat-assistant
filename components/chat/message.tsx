"use client";

import React from "react";

import { User, Sparkles, Copy, Pen, Check } from "lucide-react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface MessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-2 list-disc pl-4">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal pl-4">{children}</ol>,
  li: ({ children }) => <li className="mb-1">{children}</li>,
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-muted rounded px-1 py-0.5 text-sm" {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className={cn(
          "bg-muted block overflow-x-auto rounded-lg p-3 text-sm",
          className,
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-muted mb-2 overflow-x-auto rounded-lg">{children}</pre>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-primary/50 mb-2 border-l-2 pl-3 italic">
      {children}
    </blockquote>
  ),
};

export function Message({ role, content, isStreaming }: MessageProps) {
  const isUser = role === "user";

  const [isEditing, setIsEditint] = React.useState<boolean>(false);
  const [editText, setEditText] = React.useState<string>("");

  const [isCopied, setIsCopied] = React.useState<boolean>(false);

  const handleCopyMessage = (textContent: string) => {
    console.log(textContent);
    try {
      navigator.clipboard.writeText(textContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <div className={cn("flex flex-col w-full")}>
      <div
        className={cn(
          "flex w-full gap-2 px-2",
          isUser ? "justify-end" : "justify-start",
        )}
      >
        {!isUser && (
          <div className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full max-md:hidden">
            <Sparkles className="size-6" />
          </div>
        )}

        <div
          className={cn(
            "max-w-[75%] rounded-xl px-4 py-2",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted text-foreground rounded-tl-sm",
          )}
        >
          {isUser ? (
            <>
              {isEditing ? (
                <div></div>
              ) : (
                <p className="whitespace-pre-wrap">{content}</p>
              )}
            </>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {content}
              </ReactMarkdown>
              {isStreaming && (
                <span className="bg-primary ml-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm" />
              )}
            </div>
          )}
        </div>

        {isUser && (
          <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full max-md:hidden">
            <User className="size-6" />
          </div>
        )}
      </div>

      <div
        className={cn(
          "flex gap-2 items-center mt-2 px-2",
          isUser ? "justify-end md:mr-12" : "justify-start md:ml-12",
        )}
      >
        <Button variant="ghost" size="icon" onClick={() => setIsEditint(true)}>
          <Pen className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleCopyMessage(content)}
        >
          {isCopied ? (
            <Check className="size-4 text-green-500" />
          ) : (
            <Copy className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
