'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { completePlatformOAuth } from '@/features/home/publishing/api/platformApi';
import {
  OAuthCompletionResult,
  PlatformAccountCandidate,
  PlatformProviderId,
} from '@/features/home/publishing/models/platformModels';
import { useAuthSession } from '@/shared/providers/AuthSessionProvider';
import { isAxiosError } from 'axios';

type Props = {
  provider: PlatformProviderId;
  successRedirect?: string;
};

type Status = 'idle' | 'loading' | 'error';

const buildSelectionStorageKey = (provider: PlatformProviderId) => `pb.oauth.selection:${provider}`;

type StoredSelection = {
  state: string;
  candidates: PlatformAccountCandidate[];
  selectedAccountId: string | null;
};

const SELECTION_MESSAGES: Record<PlatformProviderId, string> = {
  meta: 'Select which Instagram account you want to connect.',
  tiktok: 'Select which TikTok account you want to connect.',
  youtube: 'Select which YouTube channel you want to connect.',
};

function getSelectionMessage(provider: PlatformProviderId) {
  return SELECTION_MESSAGES[provider] ?? 'Select which account you want to connect.';
}

function saveSelection(provider: PlatformProviderId, data: StoredSelection) {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    sessionStorage.setItem(buildSelectionStorageKey(provider), JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

function loadSelection(provider: PlatformProviderId): StoredSelection | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const raw = sessionStorage.getItem(buildSelectionStorageKey(provider));
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<StoredSelection> & { selectedPageId?: string | null };
    return {
      state: parsed.state ?? '',
      candidates: parsed.candidates ?? [],
      selectedAccountId: parsed.selectedAccountId ?? parsed.selectedPageId ?? null,
    };
  } catch {
    sessionStorage.removeItem(buildSelectionStorageKey(provider));
    return null;
  }
}

function clearSelection(provider: PlatformProviderId) {
  if (typeof window === 'undefined') {
    return;
  }
  sessionStorage.removeItem(buildSelectionStorageKey(provider));
}

export default function OAuthCallbackHandler({ provider, successRedirect = '/publishing' }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { hydrated, tokens } = useAuthSession();
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState<string>('Finalizing the connection...');
  const [selectionOptions, setSelectionOptions] = useState<PlatformAccountCandidate[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const paramsRef = useRef<{ code: string; state: string } | null>(null);
  const mountedRef = useRef(true);

  const redirectToSuccess = useCallback(() => {
    const targetUrl = `${successRedirect}?connected=${provider}`;
    router.replace(targetUrl);
    setTimeout(() => {
      if (mountedRef.current) {
        window.location.href = targetUrl;
      }
    }, 200);
  }, [provider, router, successRedirect]);

  const handleResult = useCallback(
    (params: { code: string; state: string }, result: OAuthCompletionResult, pageId?: string | null) => {
      if (result.status === 'CONNECTED' && result.connection) {
        clearSelection(provider);
        redirectToSuccess();
        return;
      }

      if (result.status === 'SELECTION_REQUIRED' && result.candidates?.length) {
        const nextSelected = pageId ?? result.candidates[0]?.primaryId ?? null;
        setSelectionOptions(result.candidates);
        setSelectedAccountId(nextSelected);
        setStatus('idle');
        setMessage(getSelectionMessage(provider));
        saveSelection(provider, { state: params.state, candidates: result.candidates, selectedAccountId: nextSelected });
        return;
      }

      const detail = result.message ?? 'Unable to complete the connection. Please try again or contact support.';
      setSelectionOptions([]);
      clearSelection(provider);
      setStatus('error');
      setMessage(detail);
    },
    [provider, redirectToSuccess]
  );

  const runCompletion = useCallback(
    async (pageId?: string | null) => {
      const params = paramsRef.current;
      if (!params || !mountedRef.current) {
        return;
      }

      setStatus('loading');
      setMessage(pageId ? 'Linking the selected account...' : 'Finalizing the connection...');

      try {
        const result = await completePlatformOAuth(provider, {
          code: params.code,
          state: params.state,
          pageId: pageId ?? undefined,
        });

        if (!mountedRef.current) {
          return;
        }

        handleResult(params, result, pageId);
      } catch (err) {
        if (!mountedRef.current) {
          return;
        }

        let detail = 'Unable to complete the connection. Please try again or contact support.';

        if (isAxiosError(err) && typeof err.response?.data === 'string') {
          detail = err.response.data;
        }

        setSelectionOptions([]);
        setStatus('error');
        setMessage(detail);
      }
    },
    [handleResult, provider]
  );

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!tokens) {
      setStatus('error');
      setMessage('Your session expired while connecting. Please sign in again and relaunch the connector.');
      return;
    }

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

    mountedRef.current = true;
    paramsRef.current = { code, state };

    const stored = loadSelection(provider);
    if (stored && stored.state === state) {
      setSelectionOptions(stored.candidates);
      setSelectedAccountId(stored.selectedAccountId ?? stored.candidates[0]?.primaryId ?? null);
      setStatus('idle');
      setMessage(getSelectionMessage(provider));
    } else {
        setSelectionOptions([]);
      void runCompletion();
    }

    return () => {
      mountedRef.current = false;
      paramsRef.current = null;
      clearSelection(provider);
    };
  }, [hydrated, provider, runCompletion, searchParams, tokens]);

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

        {selectionOptions.length > 0 ? (
          <Stack spacing={2}>
            <Typography>{getSelectionMessage(provider)}</Typography>
            <Stack spacing={1}>
              {selectionOptions.map((candidate) => {
                const active = selectedAccountId === candidate.primaryId;
                const primaryLabel = candidate.primaryName ?? 'Account';
                const secondaryLabel = candidate.secondaryHandle || candidate.secondaryName;
                return (
                  <Button
                    key={candidate.primaryId}
                    variant={active ? 'contained' : 'outlined'}
                    color={active ? 'primary' : 'inherit'}
                    onClick={() => {
                      setSelectedAccountId(candidate.primaryId);
                      if (paramsRef.current) {
                        saveSelection(provider, {
                          state: paramsRef.current.state,
                          candidates: selectionOptions,
                          selectedAccountId: candidate.primaryId,
                        });
                      }
                    }}
                    sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                  >
                    <Stack alignItems="flex-start">
                      <Typography fontWeight={600}>{secondaryLabel ?? primaryLabel}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {secondaryLabel ? primaryLabel : 'Account option'}
                      </Typography>
                    </Stack>
                  </Button>
                );
              })}
            </Stack>
            <Button
              variant="contained"
              disabled={!selectedAccountId || status === 'loading'}
              onClick={() => {
                if (selectedAccountId) {
                  void runCompletion(selectedAccountId);
                }
              }}
              startIcon={status === 'loading' ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {status === 'loading' ? 'Connecting...' : 'Connect selected account'}
            </Button>
          </Stack>
        ) : (
          <>
            {status !== 'error' && (
              <Stack spacing={2} alignItems="center">
                <CircularProgress />
                <Typography color="text.secondary">{message}</Typography>
              </Stack>
            )}

            {status === 'error' && (
              <>
                <Alert severity="error">{message}</Alert>
                <Button variant="contained" onClick={handleBack}>
                  Return to Publishing
                </Button>
              </>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
}
