"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { loginUser } from "../api/authApi";
import { LoginRequest } from "../models/LoginModel";
import { AuthResponse } from "../models/AuthModel";
import { useAuthSession } from "@/shared/providers/AuthSessionProvider";
import { resolveAuthError } from "@/features/auth/utils/errorHandling";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastAttemptedEmail, setLastAttemptedEmail] = useState<string | null>(null);
  const router = useRouter();
  const { setSession } = useAuthSession();
  const redirectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimeout.current) {
        clearTimeout(redirectTimeout.current);
      }
    };
  }, []);

  const handleLogin = async (form: LoginRequest) => {
    setLoading(true);
    setError(null);
    setErrorCode(null);
    setSuccess(false);
    setSuccessMessage(null);
    setLastAttemptedEmail(form.email);

    try {
      const data: AuthResponse = await loginUser(form);

      setSession(data);
      setSuccess(true);
      setSuccessMessage("Login successful!");
      setErrorCode(null);

      redirectTimeout.current = setTimeout(() => {
        if (data.user.onboardingStatus === "COMPLETED") {
          router.replace("/dashboard");
        } else {
          router.replace("/onboarding");
        }
      }, 800);
    } catch (err: unknown) {
      const { message, code } = resolveAuthError(err, "login");
      setError(message);
      setErrorCode(code);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    errorCode,
    success,
    successMessage,
    lastAttemptedEmail,
    handleLogin,
  };
}
