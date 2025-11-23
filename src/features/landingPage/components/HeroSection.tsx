"use client";

import { Button, Stack, Typography } from "@mui/material";
import PageContainer from "@/shared/components/layouts/PageContainer";

export default function HeroSection() {
  return (
    <PageContainer>
      <Stack spacing={4} alignItems="center" textAlign="center">
        <Typography variant="h2" fontWeight={700}>
          Create & Schedule Viral Content with AI
        </Typography>

        <Typography variant="h6" color="text.secondary" maxWidth="sm">
          Generate viral ideas, captions, and posts—then schedule and publish them automatically.
          UpPersona Ai is your all-in-one tool to grow your social presence faster.
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" size="large" color="primary">
            Get Started Free
          </Button>
          <Button variant="outlined" size="large" color="primary">
            Try Live Demo
          </Button>
        </Stack>
      </Stack>
    </PageContainer>
  );
}
