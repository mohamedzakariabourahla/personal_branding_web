"use client";

import { useState } from "react";
import {
  Stack,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useLogin } from "../hooks/useLogin";

export default function LoginForm() {
  const { loading, error, success, successMessage, handleLogin } = useLogin();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(form);
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

        {error && <Alert severity="error">{error}</Alert>}
        {success && successMessage && (
          <Alert severity="success">{successMessage} Redirecting...</Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={loading}
          sx={{ fontWeight: 700 }}
        >
          {loading ? <CircularProgress size={24} /> : "Login"}
        </Button>
      </Stack>
    </form>
  );
}
