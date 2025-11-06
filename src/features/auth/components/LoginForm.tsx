"use client";

import { useState } from "react";
import {
  Stack,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useLogin } from "../hooks/useLogin";
import { useVerificationResend } from "@/features/auth/hooks/useVerificationResend";
import NextLink from "next/link";

export default function LoginForm() {
  const { loading, error, errorCode, success, successMessage, lastAttemptedEmail, handleLogin } = useLogin();
  const [form, setForm] = useState({ email: "", password: "" });
  const {
    resend,
    resending,
    cooldown,
    successMessage: resendSuccess,
    errorMessage: resendError,
    resetFeedback,
  } = useVerificationResend(lastAttemptedEmail ?? form.email);
  const targetEmail = (lastAttemptedEmail ?? form.email).trim();
  const verifyHref = targetEmail ? `/verify-email?email=${encodeURIComponent(targetEmail)}` : "/verify-email";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin({ ...form, deviceName: typeof navigator !== "undefined" ? navigator.userAgent : undefined });
  };

  const showResendPrompt = errorCode === "USER_EMAIL_NOT_VERIFIED";

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

        {error && (
          <Alert
            severity={showResendPrompt ? "warning" : "error"}
            action={
              showResendPrompt ? (
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => resend(lastAttemptedEmail ?? form.email)}
                  disabled={resending || cooldown > 0}
                >
                  {resending
                    ? "Sending..."
                    : cooldown > 0
                    ? `Resend (${cooldown}s)`
                    : "Resend email"}
                </Button>
              ) : undefined
            }
          >
            {error}
          </Alert>
        )}

        {showResendPrompt && (resendSuccess || resendError) && (
          <Alert
            severity={resendError ? "error" : "success"}
            onClose={resendError ? resetFeedback : undefined}
          >
            {resendError ?? resendSuccess}
          </Alert>
        )}

        {showResendPrompt && !resendError && cooldown > 0 && (
          <Typography variant="caption" color="text.secondary">
            You can request another email in {cooldown} second{cooldown === 1 ? "" : "s"}.
          </Typography>
        )}

        {success && successMessage && (
          <Alert severity="success">{successMessage} Redirecting...</Alert>
        )}

        <Button
          component={showResendPrompt ? NextLink : "button"}
          type={showResendPrompt ? undefined : "submit"}
          href={showResendPrompt ? verifyHref : undefined}
          variant="contained"
          color="primary"
          size="large"
          disabled={loading || (showResendPrompt && resending)}
          sx={{ fontWeight: 700 }}
          onClick={showResendPrompt ? undefined : undefined}
        >
          {loading
            ? <CircularProgress size={24} />
            : showResendPrompt
            ? "Go to email verification"
            : "Login"}
        </Button>
      </Stack>
    </form>
  );
}
