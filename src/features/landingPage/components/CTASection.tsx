'use client';

import { Button, Stack, Typography } from '@mui/material';
import PageContainer from '@/shared/components/layouts/PageContainer';

export default function CTASection() {
  return (
    <PageContainer>
      <Stack spacing={3} alignItems="center" textAlign="center">
        <Typography variant="h4" fontWeight={700}>
          Ready to grow your social presence?
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Join thousands of creators using AI to build their personal brand.
        </Typography>
        <Button variant="contained" size="large" color="primary">
          Start Free
        </Button>
      </Stack>
    </PageContainer>
  );
}
