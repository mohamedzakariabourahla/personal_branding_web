"use client";

import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { verifyEmail } from "@/features/auth/api/authApi";
import { loadSession, persistTokens } from "@/features/auth/utils/authStorage";

type VerificationStatus = "idle" | "pending" | "success" | "error";

type VerificationResult = {
  token: string;
  status: VerificationStatus;
  error: string | null;
  verify: (nextToken?: string) => Promise<void>;
  setToken: (value: string) => void;
  reset: () => void;
};

function resolveErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string; detail?: string; errorCode?: string } | undefined;
    const code = data?.errorCode;

    if (code === "EMAIL_VERIFICATION_TOKEN_EXPIRED") {
      return "This verification link has expired. Request a new verification email and try again.";
    }
    if (code === "EMAIL_VERIFICATION_TOKEN_NOT_FOUND") {
      return "This verification link is invalid or has already been used.";
    }

    return data?.detail ?? data?.message ?? "Unable to verify your email address right now.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to verify your email address right now.";
}

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
        setError(resolveErrorMessage(err));
      }
    },
    [token]
  );

  useEffect(() => {
    if (initialToken) {
      verify(initialToken);
    } else {
      setStatus("idle");
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
