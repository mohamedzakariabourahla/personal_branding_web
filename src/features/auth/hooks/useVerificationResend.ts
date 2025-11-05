"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { resendVerificationEmailGuest } from "@/features/auth/api/authApi";
import { resolveAuthError } from "@/features/auth/utils/errorHandling";

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
        const cooldownSeconds = await resendVerificationEmailGuest(targetEmail);
        lastEmailRef.current = targetEmail;
        setSuccessMessage("Verification email sent. Check your inbox.");
        const normalizedCooldown =
          cooldownSeconds !== null && Number.isFinite(cooldownSeconds)
            ? Math.max(Math.ceil(cooldownSeconds), 0)
            : DEFAULT_COOLDOWN_SECONDS;
        setCooldown(normalizedCooldown);
      } catch (error) {
        const { message } = resolveAuthError(error, "verification-resend");
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
