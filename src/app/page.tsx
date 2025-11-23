
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useAuthSession } from '@/shared/providers/AuthSessionProvider';

export default function Home() {
  const router = useRouter();
  const { hydrated, tokens } = useAuthSession();

  useEffect(() => {
    if (!hydrated) return;
    const destination = tokens ? '/dashboard' : '/landingPage';
    router.replace(destination);
  }, [hydrated, tokens, router]);

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Stack spacing={2} alignItems="center">
        <CircularProgress />
        <Typography color="text.secondary">Checking your session…</Typography>
      </Stack>
    </Box>
  );
}
