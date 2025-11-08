'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { completePlatformOAuth } from '@/features/home/publishing/api/platformApi';
import { PlatformProviderId } from '@/features/home/publishing/models/platformModels';

type Props = {
  provider: PlatformProviderId;
  successRedirect?: string;
};

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function OAuthCallbackHandler({ provider, successRedirect = '/publishing' }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('Finalizing the connection...');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      setStatus('error');
      setMessage(errorDescription || 'The provider returned an error.');
      return;
    }

    if (!code || !state) {
      setStatus('error');
      setMessage('Missing authorization parameters. Please try again.');
      return;
    }

    const complete = async () => {
      setStatus('loading');
      try {
        await completePlatformOAuth(provider, { code, state });
        setStatus('success');
        setMessage('Account connected successfully. Redirecting you back to Publishing...');
        setTimeout(() => {
          router.replace(`${successRedirect}?connected=${provider}`);
        }, 1500);
      } catch (err) {
        console.error(err);
        setStatus('error');
        setMessage('Unable to complete the connection. Please try again or contact support.');
      }
    };

    void complete();
  }, [provider, router, searchParams, successRedirect]);

  const handleBack = () => router.replace('/publishing');

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Stack
        spacing={3}
        sx={{
          maxWidth: 480,
          width: '100%',
          textAlign: 'center',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 4,
          p: 4,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          {provider === 'tiktok' ? 'TikTok' : provider === 'meta' ? 'Instagram/Facebook' : 'YouTube'} Connection
        </Typography>

        {status === 'loading' && (
          <Stack spacing={2} alignItems="center">
            <CircularProgress />
            <Typography color="text.secondary">{message}</Typography>
          </Stack>
        )}

        {status === 'success' && <Alert severity="success">{message}</Alert>}

        {status === 'error' && (
          <>
            <Alert severity="error">{message}</Alert>
            <Button variant="contained" onClick={handleBack}>
              Return to Publishing
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
}
