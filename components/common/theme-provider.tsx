"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useAccentColor } from "@/hooks/use-accent-color";

function AccentColorWatcher() {
  useAccentColor();
  return null;
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <AccentColorWatcher />
      {children}
    </NextThemesProvider>
  );
}
