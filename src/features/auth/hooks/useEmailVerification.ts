"use client";

import { useCallback, useEffect, useState } from "react";
import { verifyEmail } from "@/features/auth/api/authApi";
import { loadSession, persistTokens } from "@/features/auth/utils/authStorage";
import { resolveAuthError } from "@/features/auth/utils/errorHandling";

type VerificationStatus = "idle" | "pending" | "success" | "error";

type VerificationResult = {
  token: string;
  status: VerificationStatus;
  error: string | null;
  verify: (nextToken?: string) => Promise<void>;
  setToken: (value: string) => void;
  reset: () => void;
};

export function useEmailVerification(initialToken: string): VerificationResult {
  const [token, setToken] = useState(initialToken.trim());
  const [status, setStatus] = useState<VerificationStatus>(initialToken ? "pending" : "idle");
  const [error, setError] = useState<string | null>(null);

  const verify = useCallback(
    async (nextToken?: string) => {
      const resolved = (nextToken ?? token).trim();
      if (!resolved) {
        setError("A verification token is required.");
        setStatus("error");
        return;
      }

      setStatus("pending");
      setError(null);

      try {
        await verifyEmail(resolved);
        const session = loadSession();
        if (session?.tokens && session.user) {
          persistTokens(session.tokens, { ...session.user, emailVerified: true });
        }
        setStatus("success");
      } catch (err) {
        setStatus("error");
        const { message } = resolveAuthError(err, "verify-email");
        setError(message);
      }
    },
    [token]
  );

  useEffect(() => {
    const trimmed = initialToken.trim();
    setToken(trimmed);

    if (trimmed) {
      verify(trimmed);
    } else {
      setStatus("idle");
      setError(null);
    }
    // we intentionally run this effect only when the initial query token changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialToken]);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  return {
    token,
    status,
    error,
    verify,
    setToken,
    reset,
  };
}
