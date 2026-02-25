"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { colorPresets, type AccentColor } from "@/lib/accent-colors";

export function useAccentColor() {
  const { theme, systemTheme } = useTheme();
  const [accentColor, setAccentColor] = useState<AccentColor>("default");
  const [mounted, setMounted] = useState(false);

  const applyColor = (
    colorKey: AccentColor,
    currentTheme: string | undefined,
  ) => {
    const root = document.documentElement;
    const preset = colorPresets[colorKey];
    const isDark =
      currentTheme === "dark" ||
      (currentTheme === "system" && systemTheme === "dark");

    if (!preset) {
      root.style.removeProperty("--primary");
      root.style.removeProperty("--primary-foreground");
      root.style.removeProperty("--ring");
      root.style.removeProperty("--accent");
      root.style.removeProperty("--accent-foreground");
      return;
    }

    Object.entries(preset).forEach(([key, value]) => {
      if (key !== "light" && key !== "dark") {
        root.style.setProperty(key, value as string);
      }
    });

    const themeStyles = isDark ? preset.dark : preset.light;
    Object.entries(themeStyles).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  };

  useEffect(() => {
    setMounted(true);
    const savedColor = localStorage.getItem("accentColor") as AccentColor;
    if (savedColor && colorPresets[savedColor]) {
      setAccentColor(savedColor);
      applyColor(savedColor, theme);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      applyColor(accentColor, theme);
    }
  }, [accentColor, theme, mounted, systemTheme]);

  const updateAccentColor = (color: AccentColor) => {
    setAccentColor(color);
    localStorage.setItem("accentColor", color);
  };

  return { accentColor, updateAccentColor };
}
