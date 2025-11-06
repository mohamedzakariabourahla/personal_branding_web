import { AuthResponse, AuthTokens, AuthUser } from "../models/AuthModel";

export interface StoredSession {
  tokens: AuthTokens;
  user: AuthUser | null;
}

type SessionListener = (session: StoredSession | null) => void;

const listeners = new Set<SessionListener>();
let inMemorySession: StoredSession | null = null;

export function loadSession(): StoredSession | null {
  return inMemorySession;
}

export function persistSession(auth: AuthResponse): void {
  persistTokens(auth.tokens, auth.user);
}

export function persistTokens(tokens: AuthTokens, user: AuthUser | null): void {
  inMemorySession = {
    tokens,
    user,
  };
  notifyListeners(inMemorySession);
}

export function clearSessionStorage(): void {
  inMemorySession = null;
  notifyListeners(null);
}

export function getStoredTokens(): AuthTokens | null {
  return inMemorySession?.tokens ?? null;
}

export function getStoredUser(): AuthUser | null {
  return inMemorySession?.user ?? null;
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
