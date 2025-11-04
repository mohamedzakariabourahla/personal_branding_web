"use client";

import { useCallback, useMemo, useState } from "react";
import { useAuthSession } from "@/shared/providers/AuthSessionProvider";
import { requestPasswordReset } from "@/features/auth/api/authApi";

type Feedback = { message: string; severity: "success" | "error" | "info" };

export function useProfileSettings() {
  const { user, tokens, updateTokens, logout } = useAuthSession();
  const [submittingReset, setSubmittingReset] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const onboardingStatus = useMemo(() => user?.onboardingStatus ?? "NOT_STARTED", [user]);
  const roles = useMemo(() => user?.roles ?? [], [user]);
  const person = user?.person ?? null;

  const handlePasswordReset = useCallback(async () => {
    if (!user?.email) {
      setFeedback({ severity: "error", message: "Email address not available for this account." });
      return;
    }

    setSubmittingReset(true);
    try {
      await requestPasswordReset(user.email);
      setFeedback({
        severity: "success",
        message:
          "If your email is registered, you will receive password reset instructions shortly.",
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to request password reset right now. Please try again.";
      setFeedback({ severity: "error", message });
    } finally {
      setSubmittingReset(false);
    }
  }, [user?.email]);

  const clearFeedback = useCallback(() => setFeedback(null), []);

  return {
    user,
    tokens,
    onboardingStatus,
    roles,
    person,
    submittingReset,
    feedback,
    requestPasswordReset: handlePasswordReset,
    clearFeedback,
    logout,
    updateTokens,
  };
}
