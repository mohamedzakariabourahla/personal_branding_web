import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  Snackbar,
  Stack,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import PlatformConnectCard from '@/features/home/publishing/components/PlatformConnectCard';
import ConnectionList from '@/features/home/publishing/components/ConnectionList';
import { PublishingHeader } from '@/features/home/publishing/components/PublishingHeader';
import {
  SUPPORTED_PLATFORMS,
  PLATFORM_PROVIDERS,
  PlatformConnection,
  PlatformProviderId,
  SupportedPlatform,
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

  const providerById = useMemo(
    () => new Map(PLATFORM_PROVIDERS.map((provider) => [provider.id, provider])),
    []
  );

  const platformCatalog = useMemo(() => {
    return SUPPORTED_PLATFORMS.map((platform) => {
      const provider = platform.providerId ? providerById.get(platform.providerId) : null;
      return {
        ...platform,
        accent: platform.accent ?? provider?.accent ?? theme.palette.primary.main,
        badge: platform.badge ?? provider?.badge,
        disabled: platform.status === 'coming_soon' || platform.status === 'planned',
      };
    });
  }, [providerById, theme.palette.primary.main]);

  const connectablePlatforms = useMemo(
    () => platformCatalog.filter((platform) => Boolean(platform.providerId) && !platform.disabled),
    [platformCatalog]
  );

  const [selectedPlatformCode, setSelectedPlatformCode] = useState<string | null>(
    connectablePlatforms[0]?.code ?? null
  );

  const loadConnections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchPlatformConnections();
      setConnections(result.connections);
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
      router.replace(`/publishing/accounts${params.toString() ? `?${params}` : ''}`);
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

  const connectionsByPlatform = useMemo(() => {
    const map = new Map<string, PlatformConnection[]>();
    connections.forEach((connection) => {
      const key = connection.platformName.toLowerCase();
      const list = map.get(key);
      if (list) {
        list.push(connection);
      } else {
        map.set(key, [connection]);
      }
    });
    return map;
  }, [connections]);

  const selectedPlatform: SupportedPlatform | null = useMemo(
    () => platformCatalog.find((platform) => platform.code === selectedPlatformCode) ?? null,
    [platformCatalog, selectedPlatformCode]
  );

  const selectedProviderConfig = useMemo(() => {
    if (!selectedPlatform?.providerId) return null;
    const provider = providerById.get(selectedPlatform.providerId);
    if (!provider) return null;
    return {
      ...provider,
      name: selectedPlatform.name,
      description: selectedPlatform.description,
      badge: selectedPlatform.badge ?? provider.badge,
      accent: selectedPlatform.accent ?? provider.accent,
      disabled: selectedPlatform.disabled,
    };
  }, [providerById, selectedPlatform]);

  return (
    <Stack spacing={{ xs: 2, md: 4 }}>
      <Stack spacing={2}>
        <PublishingHeader active="accounts" />
        <Box>
          <Typography variant="h4" fontWeight={800} mt={theme.spacing(1)}>
            Manage publishing connectors
          </Typography>
          <Typography color="text.secondary" maxWidth={theme.spacing(75)}>
            Connect Instagram (beta). Additional platforms are coming soon—add them now to stay informed.
          </Typography>
        </Box>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <Stack spacing={2}>
        <Typography variant="h6" fontWeight={700}>
          Add or connect a platform
        </Typography>
        <Autocomplete
          options={platformCatalog}
          getOptionLabel={(option) => option.name}
          value={selectedPlatform}
          onChange={(_, next) => setSelectedPlatformCode(next?.code ?? null)}
          isOptionEqualToValue={(option, value) => option.code === value.code}
          renderInput={(params) => <TextField {...params} label="Choose a platform" size="small" />}
          renderOption={(props, option) => (
            <li {...props} key={option.code}>
              <Stack direction="column" spacing={0.5} sx={{ width: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Chip
                    size="small"
                    label={option.name}
                    sx={{
                      backgroundColor: option.accent ?? theme.palette.action.selected,
                      color: theme.palette.getContrastText(option.accent ?? theme.palette.primary.main),
                    }}
                  />
                  {option.badge && <Chip size="small" label={option.badge} variant="outlined" />}
                  {option.disabled && (
                    <Chip size="small" label="Coming soon" variant="outlined" color="default" />
                  )}
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {option.description}
                </Typography>
              </Stack>
            </li>
          )}
        />

        {selectedProviderConfig ? (
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid size={{ xs: 12 }}>
              <PlatformConnectCard
                config={selectedProviderConfig}
                connections={connectionsByPlatform.get(selectedProviderConfig.platformKey.toLowerCase())}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                isBusy={busyProvider === selectedProviderConfig.id}
              />
            </Grid>
          </Grid>
        ) : (
          <Alert severity="info">
            This platform integration is planned. We&apos;ll notify you when it&apos;s ready to connect.
          </Alert>
        )}
      </Stack>

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
