"use client";

import React from "react";

import { User, Sparkles, Copy, Pen, Check, RefreshCw } from "lucide-react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

interface MessageProps {
  messageId?: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  isLastAssistant?: boolean;
  onEdit?: (messageId: string, newContent: string) => Promise<boolean>;
  onRegenerate?: () => void;
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-4 mt-6 text-2xl font-bold first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 mt-5 text-xl font-semibold first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-4 text-lg font-semibold first:mt-0">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-2 mt-3 text-base font-semibold first:mt-0">{children}</h4>
  ),
  p: ({ children }) => <p className="mb-3 leading-7 last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="mb-3 ml-1 list-disc space-y-1.5 pl-5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 ml-1 list-decimal space-y-1.5 pl-5">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-7">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="bg-primary/10 text-primary rounded-md px-1.5 py-0.5 text-[0.85em] font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }

    const language = className?.replace("language-", "") || "";

    return (
      <code
        className={cn(
          "block overflow-hidden text-sm font-mono leading-relaxed",
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-between border-b p-2">
          {language && (
            <span className="text-muted-foreground ml-2 block text-xs uppercase tracking-wide">
              {language}
            </span>
          )}
          <Button
            size="xs"
            variant="ghost"
            onClick={() => {
              navigator.clipboard.writeText(children as string);
            }}
          >
            Copy
          </Button>
        </div>
        <div className="p-2">{children}</div>
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-muted/70 border-border mb-3 overflow-x-auto rounded-xl border">
      {children}
    </pre>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary font-medium underline decoration-primary/30 underline-offset-2 transition-colors hover:decoration-primary/60"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-primary/40 bg-primary/5 mb-3 rounded-r-lg border-l-3 py-2 pl-4 pr-3 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-border my-6" />,
  table: ({ children }) => (
    <div className="mb-3 overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-muted/50 border-b">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="border-t px-3 py-2">{children}</td>,
};

export function Message({
  messageId,
  role,
  content,
  isStreaming,
  isLastAssistant,
  onEdit,
  onRegenerate,
}: MessageProps) {
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

  const handleEditSave = async (editedText: string) => {
    if (onEdit && messageId) {
      const success = await onEdit(messageId, editedText);
      if (success) {
        toast.success("The message has been edited successfully");
        setIsEditint(false);
      } else {
        toast.error("Error saving message");
      }
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div
        className={cn(
          "flex w-full gap-2 px-2",
          isUser ? "justify-end" : "justify-start",
        )}
      >
        {!isUser && (
          <div className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full max-md:hidden">
            <Sparkles className="size-5" />
          </div>
        )}

        <div
          className={cn(
            "rounded-xl px-3 py-2",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted text-foreground rounded-tl-sm",
            isEditing ? "max-w-full bg-transparent w-full p-0" : "max-w-full",
          )}
        >
          {isUser ? (
            <>
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <Textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="max-h-40 min-h-20 h-30"
                  />

                  <div className="flex items-center justify-end gap-2 mb-2">
                    <Button variant="ghost" onClick={() => setIsEditint(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleEditSave(editText)}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{content}</p>
              )}
            </>
          ) : (
            <>
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <Textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="max-h-40 min-h-20 h-30"
                  />

                  <div className="flex items-center justify-end gap-2 mb-2">
                    <Button variant="ghost" onClick={() => setIsEditint(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleEditSave(editText)}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="max-w-none">
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
            </>
          )}
        </div>

        {isUser && (
          <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full max-md:hidden">
            <User className="size-5" />
          </div>
        )}
      </div>

      <div
        className={cn(
          "flex gap-2 items-center px-2 my-2",
          isUser ? "justify-end md:mr-12" : "justify-start md:ml-12",
          isEditing && "hidden",
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setEditText(content);
            setIsEditint(true);
          }}
        >
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
        {isLastAssistant && !isStreaming && onRegenerate && (
          <Button variant="ghost" size="icon" onClick={onRegenerate}>
            <RefreshCw className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
