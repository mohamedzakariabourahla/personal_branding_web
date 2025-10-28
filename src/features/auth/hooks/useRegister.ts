"use client";

import { useState } from "react";
import { registerUser } from "../api/authApi";
import { RegisterRequest } from "../models/RegisterModel";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (form: RegisterRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await registerUser(form);
      setSuccess(true);
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

  return { loading, error, success, handleRegister };
}
