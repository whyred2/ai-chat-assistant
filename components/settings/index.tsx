"use client";

import React from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { useSession } from "@/components/providers/session-provider";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Settings as SettingsIcon,
  Database,
  Brain,
  UserRound,
} from "lucide-react";

import { GeneralSettings } from "./general-settings";
import { AISettings } from "./ai-settings";
import { DataSettings } from "./data-settings";
import { PersonaSettings } from "./persona-settings";
import { useChat } from "@/components/providers/chat-provider";

import { cn } from "@/lib/utils";

type SettingsSection = "general" | "ai" | "data" | "persona";

interface UserProfile {
  id: string;
  name: string | null;
  persona?: string | null;
}

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { sessionId, refetchUser } = useSession();

  const [activeSection, setActiveSection] =
    React.useState<SettingsSection>("general");
  const [appearance, setAppearance] = React.useState(theme || "system");

  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = React.useState<boolean>(false);
  const [deletingChats, setDeletingChats] = React.useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);

  // AI Settings
  const [enableSummarization, setEnableSummarization] =
    React.useState<boolean>(true);
  const [messageHistoryLimit, setMessageHistoryLimit] =
    React.useState<number>(20);
  const [loadingAISettings, setLoadingAISettings] =
    React.useState<boolean>(false);

  const { refreshChats } = useChat();

  const sections = [
    { id: "general" as const, label: "General", icon: SettingsIcon },
    { id: "ai" as const, label: "AI Settings", icon: Brain },
    { id: "persona" as const, label: "User Persona", icon: UserRound },
    { id: "data" as const, label: "Data", icon: Database },
  ];

  React.useEffect(() => {
    if (open) {
      setAppearance(theme || "system");
    }
  }, [open, theme]);

  React.useEffect(() => {
    if (open && sessionId && activeSection === "persona") {
      fetchProfile();
    }
    if (open && sessionId && activeSection === "ai") {
      fetchAISettings();
    }
  }, [open, sessionId, activeSection]);

  const fetchProfile = async () => {
    if (!sessionId) return;
    setLoadingProfile(true);
    try {
      const response = await fetch("/api/user/profile", {
        headers: { "X-Session-Id": sessionId },
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchAISettings = async () => {
    if (!sessionId) return;
    setLoadingAISettings(true);
    try {
      const response = await fetch("/api/user/ai-settings", {
        headers: { "X-Session-Id": sessionId },
      });
      if (response.ok) {
        const data = await response.json();
        setEnableSummarization(data.enableSummarization);
        setMessageHistoryLimit(data.messageHistoryLimit);
      }
    } catch (error) {
      console.error("Error fetching AI settings:", error);
    } finally {
      setLoadingAISettings(false);
    }
  };

  const updateAISettings = async (updates: Record<string, unknown>) => {
    if (!sessionId) return;
    try {
      const response = await fetch("/api/user/ai-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": sessionId,
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        toast.success("AI settings saved successfully");
        refetchUser();
      } else {
        toast.error("Failed to save AI settings");
      }
    } catch (error) {
      console.error("Error updating AI settings:", error);
      toast.error("Failed to save AI settings");
    }
  };

  const handleAppearanceChange = (value: string) => {
    setAppearance(value);
    setTheme(value);
  };

  const handleDeleteAllChats = async () => {
    if (!sessionId) return;
    setShowDeleteDialog(false);
    setDeletingChats(true);
    try {
      const response = await fetch("/api/chat/delete-all", {
        method: "DELETE",
        headers: { "X-Session-Id": sessionId },
      });

      if (response.ok) {
        toast.success("All chats deleted successfully");
        refreshChats();
        router.refresh();
      } else {
        toast.error("Failed to delete chats");
      }
    } catch (error) {
      console.error("Error deleting chats:", error);
      toast.error("Failed to delete chats");
    } finally {
      setDeletingChats(false);
    }
  };

  const handleExportData = async () => {
    if (!sessionId) return;
    toast.info("Export started");
    try {
      const response = await fetch("/api/user/export", {
        headers: { "X-Session-Id": sessionId },
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ai-bot-data-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Data exported successfully");
      } else {
        toast.error("Failed to export data");
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95%] max-w-xl gap-0 overflow-y-scroll p-0 md:max-w-4xl">
          <div className="flex h-full flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="bg-muted/30 flex w-full flex-col border-b p-4 md:w-56 md:border-r md:border-b-0">
              <DialogHeader className="mb-2 px-0 md:mb-4">
                <DialogTitle>Settings</DialogTitle>
              </DialogHeader>

              <nav className="w-full flex-1 space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50 text-muted-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                      <span>{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Main Content */}
            <main className="max-h-[60vh] min-h-[60vh] flex-1 overflow-y-scroll p-4 md:max-h-[80vh] md:p-6">
              {activeSection === "general" && (
                <GeneralSettings
                  appearance={appearance}
                  onAppearanceChange={handleAppearanceChange}
                />
              )}

              {activeSection === "ai" && (
                <AISettings
                  loading={loadingAISettings}
                  enableSummarization={enableSummarization}
                  messageHistoryLimit={messageHistoryLimit}
                  onEnableSummarizationChange={(checked) => {
                    setEnableSummarization(checked);
                    updateAISettings({ enableSummarization: checked });
                  }}
                  onMessageHistoryLimitChange={setMessageHistoryLimit}
                  onMessageHistoryLimitCommit={(value) => {
                    updateAISettings({ messageHistoryLimit: value });
                  }}
                />
              )}

              {activeSection === "data" && (
                <DataSettings
                  deletingChats={deletingChats}
                  onDeleteAllChats={() => setShowDeleteDialog(true)}
                  onExportData={handleExportData}
                />
              )}

              {activeSection === "persona" && (
                <PersonaSettings
                  profile={profile}
                  loading={loadingProfile}
                  onRefresh={fetchProfile}
                  sessionId={sessionId}
                  onProfileUpdate={refetchUser}
                />
              )}
            </main>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete all chats</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all chats?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAllChats}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
