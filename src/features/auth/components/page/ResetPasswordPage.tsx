'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Container, Stack } from '@mui/material';
import PageContainer from '@/shared/components/layouts/PageContainer';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

export function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';

  const handleSuccess = useCallback(() => {
    router.replace('/login');
  }, [router]);

  return (
    <PageContainer>
      <Container maxWidth="sm" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack spacing={3}>
          <ResetPasswordForm token={token} onSuccess={handleSuccess} />
        </Stack>
      </Container>
    </PageContainer>
  );
}
