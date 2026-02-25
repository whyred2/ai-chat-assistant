"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAccentColor } from "@/hooks/use-accent-color";
import type { AccentColor } from "@/lib/accent-colors";

interface AccentColorSelectorProps {
  className?: string;
}

export function AccentColorSelector({ className }: AccentColorSelectorProps) {
  const { accentColor, updateAccentColor } = useAccentColor();

  return (
    <Select
      value={accentColor}
      onValueChange={(val) => updateAccentColor(val as AccentColor)}
    >
      <SelectTrigger id="accent" className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">
          <div className="flex items-center gap-3">
            <div className="size-4 rounded-full bg-zinc-900 dark:bg-zinc-100" />
            Default
          </div>
        </SelectItem>
        <SelectItem value="green">
          <div className="flex items-center gap-3">
            <div className="size-4 rounded-full bg-green-600" />
            Green
          </div>
        </SelectItem>
        <SelectItem value="blue">
          <div className="flex items-center gap-3">
            <div className="size-4 rounded-full bg-blue-500" />
            Blue
          </div>
        </SelectItem>
        <SelectItem value="purple">
          <div className="flex items-center gap-3">
            <div className="size-4 rounded-full bg-purple-500" />
            Purple
          </div>
        </SelectItem>
        <SelectItem value="orange">
          <div className="flex items-center gap-3">
            <div className="size-4 rounded-full bg-orange-500" />
            Orange
          </div>
        </SelectItem>
        {/* Новые цвета */}
        <SelectItem value="red">
          <div className="flex items-center gap-3">
            <div className="size-4 rounded-full bg-red-600" />
            Red
          </div>
        </SelectItem>
        <SelectItem value="pink">
          <div className="flex items-center gap-3">
            <div className="size-4 rounded-full bg-pink-600" />
            Pink
          </div>
        </SelectItem>
        <SelectItem value="indigo">
          <div className="flex items-center gap-3">
            <div className="size-4 rounded-full bg-indigo-600" />
            Indigo
          </div>
        </SelectItem>
        <SelectItem value="teal">
          <div className="flex items-center gap-3">
            <div className="size-4 rounded-full bg-teal-600" />
            Teal
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
