"use client";

import { useCallback, useMemo, useState } from "react";
import { useAuthSession } from "@/shared/providers/AuthSessionProvider";
import { requestPasswordReset, resendVerificationEmail } from "@/features/auth/api/authApi";

type Feedback = { message: string; severity: "success" | "error" | "info" };

type ProfileSettingsResult = {
  user: ReturnType<typeof useAuthSession>["user"];
  tokens: ReturnType<typeof useAuthSession>["tokens"];
  onboardingStatus: string;
  roles: string[];
  person: ReturnType<typeof useAuthSession>["user"] extends infer U
    ? U extends { person: infer P }
      ? P
      : null
    : null;
  emailVerified: boolean;
  submittingReset: boolean;
  resendingVerification: boolean;
  feedback: Feedback | null;
  requestPasswordReset: () => Promise<void>;
  resendEmailVerification: () => Promise<void>;
  clearFeedback: () => void;
  logout: ReturnType<typeof useAuthSession>["logout"];
  updateTokens: ReturnType<typeof useAuthSession>["updateTokens"];
};

export function useProfileSettings(): ProfileSettingsResult {
  const { user, tokens, updateTokens, logout } = useAuthSession();
  const [submittingReset, setSubmittingReset] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const onboardingStatus = useMemo(() => user?.onboardingStatus ?? "NOT_STARTED", [user]);
  const roles = useMemo(() => user?.roles ?? [], [user]);
  const person = user?.person ?? null;
  const emailVerified = user?.emailVerified ?? false;

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

  const handleResendVerification = useCallback(async () => {
    setResendingVerification(true);
    try {
      await resendVerificationEmail();
      setFeedback({
        severity: "success",
        message: "Verification email sent. Please check your inbox.",
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to resend verification email right now. Please try again.";
      setFeedback({ severity: "error", message });
    } finally {
      setResendingVerification(false);
    }
  }, []);

  const clearFeedback = useCallback(() => setFeedback(null), []);

  return {
    user,
    tokens,
    onboardingStatus,
    roles,
    person,
    emailVerified,
    submittingReset,
    resendingVerification,
    feedback,
    requestPasswordReset: handlePasswordReset,
    resendEmailVerification: handleResendVerification,
    clearFeedback,
    logout,
    updateTokens,
  };
}
