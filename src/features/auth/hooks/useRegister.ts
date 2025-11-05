"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { registerUser } from "../api/authApi";
import { RegisterRequest } from "../models/RegisterModel";
import { RegistrationPendingResponse } from "../models/AuthModel";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [verificationExpiresAt, setVerificationExpiresAt] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const handleRegister = async (form: RegisterRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setSuccessMessage(null);
    setVerificationExpiresAt(null);
    setRegisteredEmail(null);

    try {
      const response: RegistrationPendingResponse = await registerUser(form);
      setSuccess(true);
      setRegisteredEmail(response.email);
      setVerificationExpiresAt(response.verificationExpiresAt);
      setSuccessMessage(
        response.message ||
          "Account created! Check your inbox for a verification link before signing in."
      );
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const data = err.response?.data as
          | { message?: string; detail?: string; errorCode?: string; retryAfterSeconds?: number }
          | undefined;
        const errorCode = data?.errorCode;

        if (errorCode === "USER_EMAIL_EXISTS") {
          setError("An account with this email already exists. Sign in or reset your password.");
        } else if (errorCode === "EMAIL_VERIFICATION_RATE_LIMITED") {
          const retryAfter =
            data?.retryAfterSeconds ?? Number(err.response?.headers?.["retry-after"]) ?? null;
          setError(
            retryAfter && Number.isFinite(retryAfter)
              ? `You requested a verification email recently. Please wait ${Math.max(
                  Math.ceil(Number(retryAfter)),
                  1
                )} second(s) before trying again.`
              : "You requested a verification email recently. Please wait before trying again."
          );
        } else if (errorCode === "INVALID_CREDENTIALS" || errorCode === "USER_EMAIL_NOT_VERIFIED") {
          setError(data?.message ?? "Unable to complete registration. Please try again.");
        } else if (data?.detail || data?.message) {
          setError(data.detail ?? data.message ?? "An unexpected error occurred.");
        } else {
          setError(err.message ?? "Unable to complete registration right now. Please try again.");
        }
      } else if (err instanceof Error) {
        setError(err.message || "Unable to complete registration right now. Please try again.");
      } else {
        setError("Unable to complete registration right now. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    successMessage,
    verificationExpiresAt,
    registeredEmail,
    handleRegister,
  };
}
