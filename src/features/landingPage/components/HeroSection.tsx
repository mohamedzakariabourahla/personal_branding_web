'use client';

import { Button, Stack, Typography } from '@mui/material';
import PageContainer from '@/shared/components/layouts/PageContainer';

export default function HeroSection() {
  return (
    <PageContainer>
      <Stack spacing={4} alignItems="center" textAlign="center">
        <Typography variant="h2" fontWeight={700}>
          Grow your TikTok & Instagram brand with AI
        </Typography>

        <Typography variant="h6" color="text.secondary" maxWidth="sm">
          Generate viral content ideas, captions, and carousels instantly — tailored to your audience.
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" size="large" color="primary">
            Get Started
          </Button>
          <Button variant="outlined" size="large" color="primary">
            Try Demo
          </Button>
        </Stack>
      </Stack>
    </PageContainer>
  );
}
