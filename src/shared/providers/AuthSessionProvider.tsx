"use client";

import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthResponse, AuthTokens, AuthUser } from "@/features/auth/models/AuthModel";
import {
  StoredSession,
  clearSessionStorage,
  loadSession,
  persistSession,
  persistTokens,
  subscribeToSession,
} from "@/features/auth/utils/authStorage";
import { logoutUser } from "@/features/auth/api/authApi";

type AuthSessionValue = {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  hydrated: boolean;
  setSession: (session: AuthResponse) => void;
  updateTokens: (tokens: AuthTokens, user?: AuthUser | null) => void;
  clearSession: () => void;
  logout: () => Promise<void>;
};

const AuthSessionContext = createContext<AuthSessionValue | undefined>(undefined);

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const applySession = useCallback((session: StoredSession | null) => {
    setUser(session?.user ?? null);
    setTokens(session?.tokens ?? null);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      applySession(loadSession());
      setHydrated(true);
    }

    const unsubscribe = subscribeToSession((session) => {
      applySession(session);
      setHydrated(true);
    });

    return unsubscribe;
  }, [applySession, hydrated]);

  const setSession = useCallback((auth: AuthResponse) => {
    applySession({ user: auth.user, tokens: auth.tokens });
    persistSession(auth);
  }, [applySession]);

  const updateTokens = useCallback(
    (nextTokens: AuthTokens, nextUser?: AuthUser | null) => {
      const resolvedUser = typeof nextUser === "undefined" ? user : nextUser;
      applySession({ user: resolvedUser ?? null, tokens: nextTokens });
      persistTokens(nextTokens, resolvedUser ?? null);
    },
    [applySession, user]
  );

  const clearSession = useCallback(() => {
    applySession(null);
    clearSessionStorage();
  }, [applySession]);

  const logout = useCallback(async () => {
    const currentTokens = tokens ?? loadSession()?.tokens ?? null;
    try {
      if (currentTokens?.refreshToken) {
        await logoutUser(currentTokens.refreshToken);
      }
    } catch (error) {
      // We still clear the local session even if the request fails.
      console.warn("Logout request failed", error);
    } finally {
      clearSession();
    }
  }, [tokens, clearSession]);

  const value = useMemo<AuthSessionValue>(
    () => ({
      user,
      tokens,
      hydrated,
      setSession,
      updateTokens,
      clearSession,
      logout,
    }),
    [user, tokens, hydrated, setSession, updateTokens, clearSession, logout]
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);
  if (!context) {
    throw new Error("useAuthSession must be used within an AuthSessionProvider");
  }
  return context;
}
