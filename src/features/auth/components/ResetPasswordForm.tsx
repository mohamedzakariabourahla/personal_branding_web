"use client";

import { Alert, Button, Card, CardContent, CardHeader, Stack, TextField } from "@mui/material";
import { usePasswordReset } from "@/features/auth/hooks/usePasswordReset";
import { useEffect, useState } from "react";

export function ResetPasswordForm({
  token,
  onSuccess,
}: {
  token?: string;
  onSuccess: () => void;
}) {
  const {
    token: resetToken,
    setToken,
    submitting,
    success,
    error,
    resetPassword,
    canSubmit,
  } = usePasswordReset(token);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setValidationError(null);
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword.length < 8) {
      setValidationError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    await resetPassword(newPassword);
  };

  return (
    <Card variant="outlined">
      <CardHeader
        title="Reset your password"
        subheader="Create a new password to regain access to your account."
        sx={{ textAlign: "center" }}
      />
      <CardContent>
        <Stack component="form" onSubmit={handleSubmit} spacing={3}>
          <TextField
            label="Reset token"
            value={resetToken}
            onChange={(event) => setToken(event.target.value)}
            helperText="The token from the password reset email."
            required
          />

          <TextField
            label="New password"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            inputProps={{ minLength: 8 }}
          />

          <TextField
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            inputProps={{ minLength: 8 }}
          />

          {validationError && (
            <Alert severity="error" onClose={() => setValidationError(null)}>
              {validationError}
            </Alert>
          )}

          {error && (
            <Alert severity="error" onClose={() => undefined}>
              {error}
            </Alert>
          )}

          <Button
            type={success ? "button" : "submit"}
            variant="contained"
            color="primary"
            disabled={!success && (submitting || !canSubmit)}
            onClick={success ? onSuccess : undefined}
          >
            {success ? "Back to Sign In" : submitting ? "Resetting..." : "Reset Password"}
          </Button>

          {success && (
            <Alert severity="success" onClose={() => undefined}>
              Password updated successfully. You can now sign in with your new password.
            </Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
