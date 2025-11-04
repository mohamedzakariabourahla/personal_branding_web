"use client";

import { useCallback, useMemo, useState } from "react";
import { submitPasswordReset } from "@/features/auth/api/authApi";

type ResetState = {
  submitting: boolean;
  success: boolean;
  error: string | null;
};

export function usePasswordReset(initialToken?: string) {
  const [token, setToken] = useState(initialToken ?? "");
  const [state, setState] = useState<ResetState>({
    submitting: false,
    success: false,
    error: null,
  });

  const canSubmit = useMemo(() => token.trim().length > 0, [token]);

  const resetPassword = useCallback(
    async (newPassword: string) => {
      setState({ submitting: true, success: false, error: null });
      try {
        await submitPasswordReset(token.trim(), newPassword);
        setState({ submitting: false, success: true, error: null });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to reset password right now. Please try again.";
        setState({ submitting: false, success: false, error: message });
      }
    },
    [token]
  );

  return {
    token,
    setToken,
    canSubmit,
    ...state,
    resetPassword,
  };
}
