"use client";

import { useState } from "react";
import { OnboardingRequest } from "../models/OnboardingModel";
import { submitOnboarding } from "../api/authApi";

export function useOnboarding() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleOnboarding = async (payload: OnboardingRequest) => {
    setLoading(true);
    setError(null);
    try {
      await submitOnboarding(payload);
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, handleOnboarding };
}
