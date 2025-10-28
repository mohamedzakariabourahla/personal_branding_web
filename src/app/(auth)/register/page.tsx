"use client";

import { Container, Stack, Typography } from "@mui/material";
import PageContainer from "@/shared/components/layouts/PageContainer";
import RegisterForm from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <PageContainer>
      <Container maxWidth="sm">
        <Stack spacing={4} alignItems="center" textAlign="center">
          <Typography variant="h4" fontWeight={700}>
            Create Your Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign up to plan, create, and publish your social media content with AI.
          </Typography>

          <RegisterForm />
        </Stack>
      </Container>
    </PageContainer>
  );
}
