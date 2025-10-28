"use client";

import { useState } from "react";
import { loginUser } from "../api/authApi";
import { LoginRequest, LoginResponse } from "../models/LoginModel";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (form: LoginRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data: LoginResponse = await loginUser(form);

      // ✅ Store tokens locally
      localStorage.setItem("access_token", data.access_token);
      if (data.refresh_token)
        localStorage.setItem("refresh_token", data.refresh_token);

      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, handleLogin };
}
