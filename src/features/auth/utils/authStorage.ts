import { AuthResponse, AuthTokens, AuthUser } from "../models/AuthModel";

export interface StoredSession {
  tokens: AuthTokens;
  user: AuthUser | null;
}

type SessionListener = (session: StoredSession | null) => void;

const listeners = new Set<SessionListener>();
let inMemorySession: StoredSession | null = null;
const STORAGE_KEY = "pb.auth.session";

export function loadSession(): StoredSession | null {
  if (inMemorySession) {
    return inMemorySession;
  }
  const stored = readFromStorage();
  if (stored) {
    inMemorySession = stored;
  }
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
  writeToStorage(inMemorySession);
  notifyListeners(inMemorySession);
}

export function clearSessionStorage(): void {
  inMemorySession = null;
  writeToStorage(null);
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

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function readFromStorage(): StoredSession | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    storage.removeItem(STORAGE_KEY);
    return null;
  }
}

function writeToStorage(session: StoredSession | null): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }
  if (!session) {
    storage.removeItem(STORAGE_KEY);
    return;
  }
  storage.setItem(STORAGE_KEY, JSON.stringify(session));
}
