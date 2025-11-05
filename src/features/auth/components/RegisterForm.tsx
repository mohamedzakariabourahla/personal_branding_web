"use client";

import { useMemo, useState } from "react";
import { Stack, TextField, Button, Alert, CircularProgress, Typography, Link } from "@mui/material";
import { useRegister } from "../hooks/useRegister";
import NextLink from "next/link";
import { useVerificationResend } from "@/features/auth/hooks/useVerificationResend";

type RegisterFormState = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const {
    loading,
    error,
    success,
    successMessage,
    verificationExpiresAt,
    registeredEmail,
    handleRegister,
  } = useRegister();
  const [form, setForm] = useState<RegisterFormState>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    resend,
    resending,
    cooldown,
    successMessage: resendSuccess,
    errorMessage: resendError,
    resetFeedback,
  } = useVerificationResend(registeredEmail ?? form.email);

  const verificationCopy = useMemo(() => {
    if (!success || !registeredEmail) {
      return null;
    }
    const baseMessage = `We just emailed a verification link to ${registeredEmail}.`;
    if (!verificationExpiresAt) {
      return `${baseMessage} Open it to finish activating your account.`;
    }
    const expires = new Date(verificationExpiresAt);
    const formatted = Number.isNaN(expires.getTime())
      ? null
      : expires.toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });
    return formatted
      ? `${baseMessage} The link stays valid until ${formatted}.`
      : `${baseMessage} Open it to finish activating your account.`;
  }, [registeredEmail, success, verificationExpiresAt]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setValidationError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }
    await handleRegister({ email: form.email, password: form.password });
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <Stack spacing={3}>
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          fullWidth
          required
        />

        {(validationError || error) && (
          <Alert severity="error">{validationError ?? error}</Alert>
        )}
        {success && successMessage && (
          <Alert severity="success">
            <Stack spacing={1}>
              <Typography variant="body2">{successMessage}</Typography>
              {verificationCopy && <Typography variant="body2">{verificationCopy}</Typography>}
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Didn&apos;t get it? We&apos;ll send another email and token.
                </Typography>
                
                <Button
                  color="inherit"
                  size="small"
                  variant="outlined"
                  onClick={() => resend(registeredEmail ?? form.email)}
                  disabled={resending || cooldown > 0}
                >
                  {resending
                    ? "Sending..."
                    : cooldown > 0
                    ? `Resend (${cooldown}s)`
                    : "Resend verification"}
                </Button>
                
              </Stack>

            </Stack>
          </Alert>
        )}

        {resendSuccess && (
          <Alert severity="info" onClose={resetFeedback}>
            {resendSuccess}
          </Alert>
        )}
        {resendError && (
          <Alert severity="error" onClose={resetFeedback}>
            {resendError}
          </Alert>
        )}

        {success ? (
          <Button
            component={NextLink}
            href={registeredEmail ? `/verify-email?email=${encodeURIComponent(registeredEmail)}` : "/verify-email"}
            variant="contained"
            color="primary"
            size="large"
            sx={{ fontWeight: 700 }}
            fullWidth
          >
            Go to email verification
          </Button>
        ) : (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ fontWeight: 700 }}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : "Create Account"}
          </Button>
        )}
      </Stack>
    </form>
  );
}
