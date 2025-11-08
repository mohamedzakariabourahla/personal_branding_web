'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Snackbar,
  Stack,
  Grid,
  Typography,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import PlatformConnectCard from '@/features/home/publishing/components/PlatformConnectCard';
import ConnectionList from '@/features/home/publishing/components/ConnectionList';
import {
  PLATFORM_PROVIDERS,
  PlatformConnection,
  PlatformProviderId,
} from '@/features/home/publishing/models/platformModels';
import {
  deletePlatformConnection,
  fetchPlatformConnections,
  startPlatformOAuth,
} from '@/features/home/publishing/api/platformApi';
import { alpha, useTheme } from '@mui/material/styles';

export default function PublishingScreen() {
  const theme = useTheme();
  const surface = theme.palette.background.paper;
  const sectionShadow = `0 10px 30px ${alpha(theme.palette.primary.main, 0.08)}`;
  const [connections, setConnections] = useState<PlatformConnection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [busyProvider, setBusyProvider] = useState<string | null>(null);
  const [busyConnectionId, setBusyConnectionId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const loadConnections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPlatformConnections();
      setConnections(data);
    } catch (err) {
      console.error(err);
      setError('Unable to load connections. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadConnections();
  }, [loadConnections]);

  useEffect(() => {
    const connected = searchParams.get('connected');
    if (connected) {
      setToast(`Successfully connected ${connected.charAt(0).toUpperCase()}${connected.slice(1)}.`);
      const params = new URLSearchParams(searchParams.toString());
      params.delete('connected');
      router.replace(`/publishing${params.toString() ? `?${params}` : ''}`);
    }
  }, [router, searchParams]);

  const handleConnect = async (providerId: PlatformProviderId) => {
    setBusyProvider(providerId);
    setError(null);
    try {
      const { authorizationUrl } = await startPlatformOAuth(providerId);
      window.location.href = authorizationUrl;
    } catch (err) {
      console.error(err);
      setError('Unable to start the connection. Check your credentials and try again.');
      setBusyProvider(null);
    }
  };

  const handleDisconnect = async (connectionId: number) => {
    setBusyConnectionId(connectionId);
    setError(null);
    try {
      await deletePlatformConnection(connectionId);
      await loadConnections();
      setToast('Connection removed.');
    } catch (err) {
      console.error(err);
      setError('Unable to remove the connection. Please try again.');
    } finally {
      setBusyConnectionId(null);
    }
  };

  const connectionByPlatform = useMemo(() => {
    const map = new Map<string, PlatformConnection>();
    connections.forEach((connection) => {
      map.set(connection.platformName.toLowerCase(), connection);
    });
    return map;
  }, [connections]);

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" fontWeight={800} mt={theme.spacing(1)}>
          Manage publishing connectors
        </Typography>
        <Typography color="text.secondary" maxWidth={theme.spacing(75)}>
          Connect your social accounts once to handle scheduling, approvals, and analytics from a single dashboard.
          Every token is encrypted and you can revoke access at any time.
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {PLATFORM_PROVIDERS.map((provider) => (
          <Grid size={{ xs: 12, md: 6}} key={provider.id}>
            <PlatformConnectCard
              config={provider}
              connection={connectionByPlatform.get(provider.platformKey.toLowerCase())}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              isBusy={busyProvider === provider.id}
            />
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          borderRadius: 0,
          border: `1px solid ${theme.palette.divider}`,
          p: theme.spacing(3),
          boxShadow: sectionShadow,
          backgroundColor: surface,
        }}
      >
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Connected accounts
            </Typography>
            <Typography color="text.secondary">
              Each row represents a linked creator or page. Remove any account to immediately stop scheduled posts and
              API access.
            </Typography>
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: theme.spacing(4) }}>
              <CircularProgress />
            </Box>
          ) : (
            <ConnectionList connections={connections} onDisconnect={handleDisconnect} busyId={busyConnectionId} />
          )}
        </Stack>
      </Box>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        message={toast ?? ''}
      />
    </Stack>
  );
}
