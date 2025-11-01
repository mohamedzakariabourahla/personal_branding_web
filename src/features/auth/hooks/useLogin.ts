"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, successMessage, handleLogin };
}
