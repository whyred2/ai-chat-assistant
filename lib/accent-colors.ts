export const colorPresets = {
  default: null,
  green: {
    "--primary": "#16a34a", // green-600
    "--primary-foreground": "#ffffff",
    "--ring": "#16a34a",
    light: {
      "--accent": "#f0fdf4", // green-50
      "--accent-foreground": "#15803d", // green-700
    },
    dark: {
      "--accent": "#14532d", // green-900
      "--accent-foreground": "#dcfce7", // green-100
    },
  },
  blue: {
    "--primary": "#2563eb", // blue-600
    "--primary-foreground": "#ffffff",
    "--ring": "#2563eb",
    light: {
      "--accent": "#eff6ff", // blue-50
      "--accent-foreground": "#1d4ed8", // blue-700
    },
    dark: {
      "--accent": "#1e3a8a", // blue-900
      "--accent-foreground": "#dbeafe", // blue-100
    },
  },
  purple: {
    "--primary": "#9333ea", // purple-600
    "--primary-foreground": "#ffffff",
    "--ring": "#9333ea",
    light: {
      "--accent": "#faf5ff", // purple-50
      "--accent-foreground": "#7e22ce", // purple-700
    },
    dark: {
      "--accent": "#581c87", // purple-900
      "--accent-foreground": "#f3e8ff", // purple-100
    },
  },
  orange: {
    "--primary": "#ea580c", // orange-600
    "--primary-foreground": "#ffffff",
    "--ring": "#ea580c",
    light: {
      "--accent": "#fff7ed", // orange-50
      "--accent-foreground": "#c2410c", // orange-700
    },
    dark: {
      "--accent": "#7c2d12", // orange-900
      "--accent-foreground": "#ffedd5", // orange-100
    },
  },
  // Новые цвета
  red: {
    "--primary": "#dc2626", // red-600
    "--primary-foreground": "#ffffff",
    "--ring": "#dc2626",
    light: {
      "--accent": "#fef2f2", // red-50
      "--accent-foreground": "#b91c1c", // red-700
    },
    dark: {
      "--accent": "#7f1d1d", // red-900
      "--accent-foreground": "#fee2e2", // red-100
    },
  },
  pink: {
    "--primary": "#db2777", // pink-600
    "--primary-foreground": "#ffffff",
    "--ring": "#db2777",
    light: {
      "--accent": "#fdf2f8", // pink-50
      "--accent-foreground": "#be185d", // pink-700
    },
    dark: {
      "--accent": "#831843", // pink-900
      "--accent-foreground": "#fce7f3", // pink-100
    },
  },
  indigo: {
    "--primary": "#4f46e5", // indigo-600
    "--primary-foreground": "#ffffff",
    "--ring": "#4f46e5",
    light: {
      "--accent": "#eef2ff", // indigo-50
      "--accent-foreground": "#4338ca", // indigo-700
    },
    dark: {
      "--accent": "#312e81", // indigo-900
      "--accent-foreground": "#e0e7ff", // indigo-100
    },
  },
  teal: {
    "--primary": "#0d9488", // teal-600
    "--primary-foreground": "#ffffff",
    "--ring": "#0d9488",
    light: {
      "--accent": "#f0fdfa", // teal-50
      "--accent-foreground": "#0f766e", // teal-700
    },
    dark: {
      "--accent": "#134e4a", // teal-900
      "--accent-foreground": "#ccfbf1", // teal-100
    },
  },
} as const;

export type AccentColor = keyof typeof colorPresets;
