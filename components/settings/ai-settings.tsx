import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";

interface AISettingsProps {
  loading: boolean;
  enableSummarization: boolean;
  messageHistoryLimit: number;
  onEnableSummarizationChange: (enabled: boolean) => void;
  onMessageHistoryLimitChange: (limit: number) => void;
  onMessageHistoryLimitCommit: (limit: number) => void;
}

export function AISettings({
  loading,
  enableSummarization,
  messageHistoryLimit,
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
          {/* Summarization Toggle */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="space-y-1">
              <Label
                htmlFor="summarization-toggle"
                className="text-base font-medium"
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
              onCheckedChange={onEnableSummarizationChange}
            />
          </div>

          {/* Message History Limit */}
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="history-limit"
                  className="text-base font-medium"
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
              max={30}
              step={10}
              value={[messageHistoryLimit]}
              onValueChange={([value]) => onMessageHistoryLimitChange(value)}
              onValueCommit={([value]) => onMessageHistoryLimitCommit(value)}
              className="w-full"
            />
            <div className="text-muted-foreground ml-1.25 flex justify-between text-xs">
              <span>10</span>
              <span>20</span>
              <span>30</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
