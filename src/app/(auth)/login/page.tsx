"use client";

import { Container, Stack, Typography } from "@mui/material";
import PageContainer from "@/shared/components/layouts/PageContainer";
import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <PageContainer>
      <Container maxWidth="sm">
        <Stack spacing={4} alignItems="center" textAlign="center">
          <Typography variant="h4" fontWeight={700}>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Log in to continue creating, scheduling, and growing your social media presence.
          </Typography>

          <LoginForm />
        </Stack>
      </Container>
    </PageContainer>
  );
}
