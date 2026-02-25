import { useState, useEffect } from "react";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save } from "lucide-react";

import { showToast } from "@/lib/toast";

interface UserProfile {
  id: string;
  usePersona?: boolean;
  persona?: string | null;
}

interface PersonaSettingsProps {
  profile: UserProfile | null;
  loading: boolean;
  onRefresh: () => void;
  sessionId: string | null;
  onProfileUpdate: () => void;
}

export function PersonaSettings({
  profile,
  loading,
  onRefresh,
  sessionId,
  onProfileUpdate,
}: PersonaSettingsProps) {
  const [persona, setPersona] = useState(profile?.persona || "");
  const [usePersonaEnabled, setUsePersonaEnabled] = useState(
    profile?.usePersona ?? false,
  );
  const [isSaving, setIsSaving] = useState(false);

  // Sync with profile when it changes
  useEffect(() => {
    setPersona(profile?.persona || "");
    setUsePersonaEnabled(profile?.usePersona ?? false);
  }, [profile]);

  const handleSavePersona = async () => {
    if (!sessionId) return;
    setIsSaving(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": sessionId,
        },
        body: JSON.stringify({ persona: persona.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to save persona");
      }

      showToast.success("User persona saved successfully!");
      onRefresh();
      onProfileUpdate();
    } catch (error) {
      console.error("Error saving persona:", error);
      showToast.error("Failed to save user persona");
    } finally {
      setIsSaving(false);
    }
  };

  const isUnchanged = persona === (profile?.persona || "");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="mb-1 text-xl font-semibold">User Persona</h2>
        <p className="text-muted-foreground text-sm">
          Describe yourself to personalize AI responses. This information can be
          enabled/disabled per chat.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="space-y-2 rounded-lg border p-2">
            <Textarea
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              placeholder="Example: My name is Alex, I'm 25. I love sci-fi and fantasy. I work as a software developer..."
              maxLength={300}
              rows={6}
              className="resize-none wrap-anywhere"
            />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground ml-2 text-xs">
                {persona.length}/300 characters
              </span>
              <Button
                onClick={handleSavePersona}
                disabled={isSaving || isUnchanged || !sessionId}
                size="sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="space-y-1">
              <Label htmlFor="persona-toggle" className="text-base font-medium">
                Use User Persona
              </Label>
              <p className="text-muted-foreground text-sm">
                Use your persona to personalize AI responses
              </p>
            </div>
            <Switch
              id="persona-toggle"
              checked={usePersonaEnabled}
              onCheckedChange={async (checked) => {
                setUsePersonaEnabled(checked);
                if (!sessionId) return;
                try {
                  const response = await fetch("/api/user/profile", {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      "X-Session-Id": sessionId,
                    },
                    body: JSON.stringify({ usePersona: checked }),
                  });
                  if (!response.ok) throw new Error();
                  showToast.success(
                    checked ? "Persona enabled" : "Persona disabled",
                  );
                  onProfileUpdate();
                } catch {
                  setUsePersonaEnabled(!checked);
                  showToast.error("Failed to update persona setting");
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
