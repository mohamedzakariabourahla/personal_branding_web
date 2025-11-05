"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import { loginUser } from "../api/authApi";
import { LoginRequest } from "../models/LoginModel";
import { AuthResponse } from "../models/AuthModel";
import { useAuthSession } from "@/shared/providers/AuthSessionProvider";

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
      if (err instanceof AxiosError) {
        const responseData = err.response?.data as {
          detail?: string;
          message?: string;
          errorCode?: string;
          retryAfterSeconds?: number;
        } | undefined;
        const code = responseData?.errorCode ?? null;
        setErrorCode(code);

        if (code === "INVALID_CREDENTIALS") {
          setError("The email or password you entered is incorrect.");
        } else if (code === "USER_EMAIL_NOT_VERIFIED") {
          setError("Please verify your email address before signing in. Check your inbox for the verification link.");
        } else if (code === "LOGIN_RATE_LIMITED") {
          const retryAfter = responseData?.retryAfterSeconds ?? Number(err.response?.headers?.["retry-after"]) ?? null;
          setError(
            retryAfter && Number.isFinite(retryAfter)
              ? `Too many failed attempts. Please wait ${Math.ceil(Number(retryAfter) / 60)} minute(s) and try again.`
              : "Too many failed attempts. Please wait a few minutes and try again."
          );
        } else {
          setError(responseData?.detail ?? responseData?.message ?? "Unable to sign in right now. Please try again.");
        }
      } else if (err instanceof Error) {
        setError(err.message || "Unable to sign in right now. Please try again.");
        setErrorCode(null);
      } else {
        setError("Unable to sign in right now. Please try again.");
        setErrorCode(null);
      }
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
