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
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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
    setSuccess(false);
    setSuccessMessage(null);

    try {
      const data: AuthResponse = await loginUser(form);

      setSession(data);
      setSuccess(true);
      setSuccessMessage("Login successful!");

      redirectTimeout.current = setTimeout(() => {
        if (data.user.onboardingStatus === "COMPLETED") {
          router.replace("/dashboard");
        } else {
          router.replace("/onboarding");
        }
      }, 800);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const detail =
          (err.response?.data as { detail?: string; message?: string; errorCode?: string; retryAfterSeconds?: number } | undefined)
            ?.detail ??
          (err.response?.data as { detail?: string; message?: string; errorCode?: string; retryAfterSeconds?: number } | undefined)
            ?.message;
        const errorCode = (err.response?.data as { errorCode?: string } | undefined)?.errorCode;
        if (errorCode === "INVALID_CREDENTIALS") {
          setError("The email or password you entered is incorrect.");
        } else if (errorCode === "LOGIN_RATE_LIMITED") {
          const retryAfter =
            (err.response?.data as { retryAfterSeconds?: number } | undefined)?.retryAfterSeconds ??
            Number(err.response?.headers?.["retry-after"]) ??
            null;
          setError(
            retryAfter && Number.isFinite(retryAfter)
              ? `Too many failed attempts. Please wait ${Math.ceil(Number(retryAfter) / 60)} minute(s) and try again.`
              : "Too many failed attempts. Please wait a few minutes and try again."
          );
        } else {
          setError(detail ?? "Unable to sign in right now. Please try again.");
        }
      } else if (err instanceof Error) {
        setError(err.message || "Unable to sign in right now. Please try again.");
      } else {
        setError("Unable to sign in right now. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, successMessage, handleLogin };
}
