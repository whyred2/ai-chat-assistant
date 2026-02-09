"use client";

import React from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronsUpDown,
  Menu,
  EllipsisVertical,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  SquarePen,
  X,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SettingsDialog } from "../settings";
import { useChat } from "@/components/providers/chat-provider";
import { useSession } from "@/components/providers/session-provider";

export function Sidebar() {
  const pathname = usePathname();
  const { chats, isLoadingChats } = useChat();
  const { user } = useSession();

  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState<boolean>(false);
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-3.5 left-3.5 z-50 md:hidden"
      >
        <Menu className="size-5" />
      </Button>
      <aside
        ref={sidebarRef}
        className={cn(
          "bg-sidebar border-sidebar-border transition-[width, translate] flex h-screen flex-col border-r duration-300",
          // Desktop
          "md:relative",
          isCollapsed ? "md:w-12" : "md:w-80",
          // Mobile
          "fixed inset-y-0 left-0 z-50 w-80",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Header with toggle */}
        <div className="flex items-center justify-end border-b p-2">
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(false)}
            className="size-8 md:hidden"
          >
            <X className="size-5" />
          </Button>

          {/* Desktop collapse button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden size-8 md:flex"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="size-5" />
            ) : (
              <PanelLeftClose className="size-5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col space-y-1 border-b p-2">
          <Button
            asChild
            variant="ghost"
            size={isCollapsed ? "icon" : "default"}
            className={cn(
              "w-full justify-start",
              isCollapsed && "size-8 justify-center p-0",
            )}
          >
            <Link href="/">
              <SquarePen className="size-5" />
              {!isCollapsed && <span className="">New Chat</span>}
            </Link>
          </Button>
        </div>

        {/* Chats list - only when expanded */}
        {!isCollapsed ? (
          <ScrollArea className="flex-1 overflow-y-scroll px-2">
            <div className="space-y-1 py-2">
              {isLoadingChats ? (
                <p className="text-muted-foreground px-2 text-sm">
                  Загрузка...
                </p>
              ) : chats.length === 0 ? (
                <p className="text-muted-foreground px-2 text-sm">Нет чатов</p>
              ) : (
                chats.map((chat) => {
                  const isActive = pathname === `/${chat.id}`;
                  return (
                    <div key={chat.id} className="flex items-center gap-2">
                      <Button
                        asChild
                        variant={isActive ? "secondary" : "ghost"}
                        className="flex-1 justify-start h-8"
                      >
                        <Link href={`/${chat.id}`}>
                          <span className="truncate">
                            {chat.title || "Новый чат"}
                          </span>
                        </Link>
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className={cn("w-full size-8")}
                          >
                            <EllipsisVertical className="size-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem variant="destructive">
                            <Trash />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        ) : (
          <div
            className="h-full transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            onClick={() => setIsCollapsed(!isCollapsed)}
          />
        )}

        {/* Footer */}
        <div className={cn(!isCollapsed && "pb-2", "border-t px-2 pt-2")}>
          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full",
                  isCollapsed ? "mb-2 size-8 p-0" : "h-auto justify-start p-2",
                )}
              >
                {!isCollapsed && (
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <div className="min-w-0 flex-1 text-left">
                      <div className="truncate text-sm font-medium">
                        {user?.name || "User"}
                      </div>
                    </div>
                    <ChevronsUpDown className="ml-2 size-5 shrink-0 opacity-50" />
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                <Settings className="size-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Dialogs */}
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  );
}
