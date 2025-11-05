"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import { resendVerificationEmailGuest } from "@/features/auth/api/authApi";

const DEFAULT_COOLDOWN_SECONDS = 60;

export function useVerificationResend(initialEmail?: string) {
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const lastEmailRef = useRef<string | undefined>(initialEmail);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    lastEmailRef.current = initialEmail;
  }, [initialEmail]);

  useEffect(() => {
    if (cooldown <= 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [cooldown]);

  const resend = useCallback(
    async (email?: string) => {
      const targetEmail = email?.trim() || lastEmailRef.current?.trim();
      if (!targetEmail) {
        setErrorMessage("Provide an email address first.");
        return;
      }

      try {
        setResending(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        await resendVerificationEmailGuest(targetEmail);
        lastEmailRef.current = targetEmail;
        setSuccessMessage("Verification email sent. Check your inbox.");
        setCooldown(DEFAULT_COOLDOWN_SECONDS);
      } catch (error) {
        const message = resolveError(error);
        setErrorMessage(message);
      } finally {
        setResending(false);
      }
    },
    []
  );

  const resetFeedback = useCallback(() => {
    setSuccessMessage(null);
    setErrorMessage(null);
  }, []);

  return {
    resend,
    resending,
    cooldown,
    successMessage,
    errorMessage,
    resetFeedback,
  };
}

function resolveError(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string; detail?: string; errorCode?: string; retryAfterSeconds?: number } | undefined;
    const retryAfter = data?.retryAfterSeconds ?? Number(error.response?.headers?.["retry-after"] ?? NaN);
    if (data?.errorCode === "EMAIL_VERIFICATION_RATE_LIMITED" && Number.isFinite(retryAfter)) {
      const seconds = Math.max(Math.ceil(Number(retryAfter)), 1);
      return `You can request another verification email in ${seconds} second${seconds === 1 ? "" : "s"}.`;
    }
    return data?.detail ?? data?.message ?? "Unable to send verification email right now. Please try again.";
  }

  if (error instanceof Error) {
    return error.message || "Unable to send verification email right now. Please try again.";
  }

  return "Unable to send verification email right now. Please try again.";
}
