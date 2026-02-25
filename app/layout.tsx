import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/common/theme-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { ChatProvider } from "@/components/providers/chat-provider";
import { Toaster } from "@/components/ui/toaster";

import { Sidebar } from "@/components/chat/sidebar";

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "AI Chat Assistant",
  description: "AI Chat Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(comfortaa.className, "antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <ChatProvider>
              <div className="flex h-screen w-full">
                <Sidebar />
                {children}
              </div>
              <Toaster />
            </ChatProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
