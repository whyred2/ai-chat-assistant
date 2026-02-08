import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Loader2, Crown, Brain } from "lucide-react";

import { cn } from "@/lib/utils";

interface UserProfile {
  role: "USER" | "PREMIUM" | "ADMIN";
}

interface AISettingsProps {
  profile: UserProfile | null;
  loading: boolean;
  enableRAG: boolean;
  enableSummarization: boolean;
  messageHistoryLimit: number;
  onEnableRAGChange: (enabled: boolean) => void;
  onEnableSummarizationChange: (enabled: boolean) => void;
  onMessageHistoryLimitChange: (limit: number) => void;
  onMessageHistoryLimitCommit: (limit: number) => void;
}

export function AISettings({
  profile,
  loading,
  enableRAG,
  enableSummarization,
  messageHistoryLimit,
  onEnableRAGChange,
  onEnableSummarizationChange,
  onMessageHistoryLimitChange,
  onMessageHistoryLimitCommit,
}: AISettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-xl font-semibold">AI Settings</h2>
        <p className="text-muted-foreground text-sm">
          Manage AI memory and context
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* RAG Toggle */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="space-y-1">
              <Label htmlFor="rag-toggle" className="text-base font-medium">
                Semantic Search (RAG)
              </Label>
              <p className="text-muted-foreground text-sm">
                Use vector search to find relevant memories from past
                conversations
              </p>
            </div>
            <Switch
              id="rag-toggle"
              checked={enableRAG}
              onCheckedChange={onEnableRAGChange}
            />
          </div>

          {/* Summarization Toggle */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="space-y-1">
              <Label
                htmlFor="summarization-toggle"
                className={cn(
                  "text-base font-medium",
                  profile?.role === "USER" && "text-muted-foreground",
                )}
              >
                Conversation Summarization
              </Label>
              <p className="text-muted-foreground text-sm">
                Automatically create brief summaries from long dialogues to
                preserve context
              </p>
            </div>
            <Switch
              id="summarization-toggle"
              checked={enableSummarization}
              disabled={profile?.role === "USER"}
              onCheckedChange={onEnableSummarizationChange}
            />
          </div>

          {/* Message History Limit */}
          <div className="space-y-4 border-b pb-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="history-limit"
                  className={cn(
                    "text-base font-medium",
                    profile?.role === "USER" && "text-muted-foreground",
                  )}
                >
                  Message History Limit
                </Label>
                <span className="text-muted-foreground text-sm font-medium">
                  {messageHistoryLimit} messages
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Number of recent messages to pass to the AI model
              </p>
            </div>
            <Slider
              id="history-limit"
              min={10}
              max={100}
              step={10}
              disabled={profile?.role === "USER"}
              value={[messageHistoryLimit]}
              onValueChange={([value]) => onMessageHistoryLimitChange(value)}
              onValueCommit={([value]) => onMessageHistoryLimitCommit(value)}
              className="w-full"
            />
            <div className="text-muted-foreground ml-1.25 flex justify-between text-xs">
              <span>10</span>
              <span>20</span>
              <span>30</span>
              <span>40</span>
              <span>50</span>
              <span>60</span>
              <span>70</span>
              <span>80</span>
              <span>90</span>
              <span>100</span>
            </div>
          </div>

          {/* Info Banner */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="flex gap-3">
              <Brain className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Smart AI Memory
                </p>
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  Combination of RAG, summarization, and history allows AI to
                  remember important details of your conversations and provide
                  more personalized responses.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
