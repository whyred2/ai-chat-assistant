"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface User {
  id: string;
  sessionId: string;
  name: string | null;
  preferredModel: string;
  enableSummarization: boolean;
  messageHistoryLimit: number;
  usePersona: boolean;
  persona: string | null;
}

interface SessionContextType {
  user: User | null;
  sessionId: string | null;
  isLoading: boolean;
  refetchUser: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | null>(null);

const STORAGE_KEY = "session_id";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async (sid: string) => {
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": sid,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let id = localStorage.getItem(STORAGE_KEY);

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, id);
    }

    setSessionId(id);
    fetchUser(id);
  }, []);

  const refetchUser = async () => {
    if (sessionId) {
      await fetchUser(sessionId);
    }
  };

  return (
    <SessionContext.Provider
      value={{ user, sessionId, isLoading, refetchUser }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
