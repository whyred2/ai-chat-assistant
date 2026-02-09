import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DataSettingsProps {
  deletingChats: boolean;
  onDeleteAllChats: () => void;
  onExportData: () => void;
}

export function DataSettings({
  deletingChats,
  onDeleteAllChats,
  onExportData,
}: DataSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-xl font-semibold">Data</h2>
        <p className="text-muted-foreground text-sm">Data management</p>
      </div>

      <div className="flex items-center justify-between border-b py-3">
        <div>
          <Label className="text-base">Delete all chats</Label>
          <p className="text-muted-foreground text-sm">
            Permanently delete all chat history
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDeleteAllChats}
          disabled={deletingChats}
        >
          {deletingChats ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Deleting...
            </>
          ) : (
            "Delete all"
          )}
        </Button>
      </div>

      <div className="flex items-center justify-between py-3">
        <div>
          <Label className="text-base">Export data</Label>
          <p className="text-muted-foreground text-sm">
            Download all your data in JSON format
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onExportData}>
          Export
        </Button>
      </div>
    </div>
  );
}
