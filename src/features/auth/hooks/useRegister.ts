"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { registerUser } from "../api/authApi";
import { RegisterRequest } from "../models/RegisterModel";
import { AuthResponse } from "../models/AuthModel";
import { useAuthSession } from "@/shared/providers/AuthSessionProvider";

export function useRegister() {
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

  const handleRegister = async (form: RegisterRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setSuccessMessage(null);

    try {
      const response: AuthResponse = await registerUser(form);
      setSession(response);
      setSuccess(true);
      setSuccessMessage("Account created! Let's personalize your brand.");

      redirectTimeout.current = setTimeout(() => {
        router.replace("/onboarding");
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

  return { loading, error, success, successMessage, handleRegister };
}
