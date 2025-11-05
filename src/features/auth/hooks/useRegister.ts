"use client";

import { useState } from "react";
import { registerUser } from "../api/authApi";
import { RegisterRequest } from "../models/RegisterModel";
import { RegistrationPendingResponse } from "../models/AuthModel";
import { resolveAuthError } from "@/features/auth/utils/errorHandling";

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
      const { message } = resolveAuthError(err, "register");
      setError(message);
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
