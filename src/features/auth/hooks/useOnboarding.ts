"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { submitOnboarding } from "../api/authApi";
import { OnboardingRequest, OnboardingResponse } from "../models/OnboardingModel";
import { useAuthSession } from "@/shared/providers/AuthSessionProvider";

export function useOnboarding() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const { tokens, user, updateTokens } = useAuthSession();
  const redirectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimeout.current) {
        clearTimeout(redirectTimeout.current);
      }
    };
  }, []);

  const handleOnboarding = async (payload: OnboardingRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setSuccessMessage(null);

    try {
      const profile: OnboardingResponse = await submitOnboarding(payload);
      setSuccess(true);
      setSuccessMessage("Onboarding completed! Redirecting to your dashboard...");

      if (tokens && user) {
        updateTokens(tokens, {
          ...user,
          onboardingStatus: "COMPLETED",
          person: profile,
        });
      }

      redirectTimeout.current = setTimeout(() => {
        router.replace("/dashboard");
      }, 800);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("hello " + err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, successMessage, handleOnboarding };
}
