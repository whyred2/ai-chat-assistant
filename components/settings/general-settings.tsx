import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccentColorSelector } from "@/components/common/accent-color-selector";

interface GeneralSettingsProps {
  appearance: string;
  onAppearanceChange: (value: string) => void;
}

export function GeneralSettings({
  appearance,
  onAppearanceChange,
}: GeneralSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-xl font-semibold">General</h2>
        <p className="text-muted-foreground text-sm">General settings</p>
      </div>

      {/* Appearance */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="appearance" className="text-base">
            Appearance
          </Label>
          <Select value={appearance} onValueChange={onAppearanceChange}>
            <SelectTrigger id="appearance" className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Accent Color */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="accent" className="text-base">
            Accent Color
          </Label>
          <AccentColorSelector className="w-[180px]" />
        </div>
      </div>
    </div>
  );
}
