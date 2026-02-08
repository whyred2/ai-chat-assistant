import { ThemeToggle } from "@/components/common/theme-toggle";

export function Header() {
  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 z-10 flex h-16 flex-none items-center justify-between border-b px-3">
      <div className="ml-12 flex items-center gap-3 md:ml-0">
        <span className="text-xl font-bold">Chat</span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
