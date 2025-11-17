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
import { fetchCurrentSession, logoutUser, refreshTokens } from "@/features/auth/api/authApi";

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
    let cancelled = false;

    const handleSessionChange = (session: StoredSession | null) => {
      if (cancelled) {
        return;
      }
      applySession(session);
      setHydrated(true);
    };

    handleSessionChange(loadSession());

    const unsubscribe = subscribeToSession(handleSessionChange);

    const bootstrap = async () => {
      if (loadSession()) {
        setHydrated(true);
        return;
      }

      try {
        const auth =
          (await fetchCurrentSession().catch(() => null)) ??
          (await refreshTokens().catch(() => null));
        if (!cancelled && auth) {
          persistSession(auth);
        }
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [applySession]);

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
    try {
      await logoutUser();
    } catch (error) {
      // We still clear the local session even if the request fails.
      console.warn("Logout request failed", error);
    } finally {
      clearSession();
    }
  }, [clearSession]);

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
