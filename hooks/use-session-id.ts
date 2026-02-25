import { useState } from "react";

const STORAGE_KEY = "session_id";

function getOrCreateSessionId(): string {
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

/**
 * Хук для получения уникального session ID пользователя.
 * ID сохраняется в localStorage и используется для идентификации без авторизации.
 */
export function useSessionId(): string {
  const [sessionId] = useState<string>(getOrCreateSessionId);

  return sessionId;
}
