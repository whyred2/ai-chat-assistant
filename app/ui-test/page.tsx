"use client";

import { AccentColorSelector } from "@/components/common/accent-color-selector";
import { ThemeToggle } from "@/components/common/theme-toggle";

import { Switch } from "@/components/ui/switch";

export default function TestPage() {
  return (
    <div className="relative h-screen flex flex-col w-full items-center justify-center mx-auto">
      <div className="top-5 right-5 absolute flex gap-2 items-center">
        <ThemeToggle />
        <AccentColorSelector />
      </div>
      <Switch />
    </div>
  );
}
