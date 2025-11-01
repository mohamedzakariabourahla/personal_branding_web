import { AuthResponse, AuthTokens, AuthUser } from "../models/AuthModel";

const STORAGE_KEY = "pb.auth.session";

export interface StoredSession {
  tokens: AuthTokens;
  user: AuthUser | null;
}

type SessionListener = (session: StoredSession | null) => void;

const listeners = new Set<SessionListener>();

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadSession(): StoredSession | null {
  if (!isBrowser()) {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed?.tokens) {
      return null;
    }
    return {
      tokens: parsed.tokens,
      user: parsed.user ?? null,
    };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function persistSession(auth: AuthResponse): void {
  persistTokens(auth.tokens, auth.user);
}

export function persistTokens(tokens: AuthTokens, user: AuthUser | null): void {
  if (!isBrowser()) {
    return;
  }

  const payload: StoredSession = {
    tokens,
    user,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  notifyListeners(payload);
}

export function clearSessionStorage(): void {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
  notifyListeners(null);
}

export function getStoredTokens(): AuthTokens | null {
  return loadSession()?.tokens ?? null;
}

export function getStoredUser(): AuthUser | null {
  return loadSession()?.user ?? null;
}

function notifyListeners(session: StoredSession | null) {
  listeners.forEach((listener) => {
    try {
      listener(session);
    } catch {
      // ignore listener errors
    }
  });
}

export function subscribeToSession(listener: SessionListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
