"use client";

import { useState } from "react";
import { Stack, TextField, Button, Alert, CircularProgress } from "@mui/material";
import { useRegister } from "../hooks/useRegister";

type RegisterFormState = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const { loading, error, success, successMessage, handleRegister } = useRegister();
  const [form, setForm] = useState<RegisterFormState>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState<string | null>(null);

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
          <Alert severity="success">{successMessage}</Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          sx={{ fontWeight: 700 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Create Account"}
        </Button>
      </Stack>
    </form>
  );
}
