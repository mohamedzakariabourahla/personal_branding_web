"use client";

import { useState } from "react";
import { OnboardingRequest, OnboardingResponse } from "../models/OnboardingModel";
import { submitOnboarding } from "../api/authApi";

export function useOnboarding() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState<OnboardingResponse | null>(null);

  const handleOnboarding = async (payload: OnboardingRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await submitOnboarding(payload);
      setResponse(res);
      setSuccess(res.success);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, response, handleOnboarding };
}
