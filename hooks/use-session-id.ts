import { useState, useEffect } from "react";

/**
 * Хук для получения уникального session ID пользователя.
 * ID сохраняется в localStorage и используется для идентификации без авторизации.
 */
export function useSessionId(): string | null {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const STORAGE_KEY = "session_id";

    let id = localStorage.getItem(STORAGE_KEY);

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, id);
    }

    setSessionId(id);
  }, []);

  return sessionId;
}
