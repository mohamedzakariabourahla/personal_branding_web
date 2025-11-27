import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Snackbar,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { PublishingHeader } from '@/features/home/publishing/components/PublishingHeader';
import PublishingJobForm from '@/features/home/publishing/components/PublishingJobForm';
import PublishingJobList from '@/features/home/publishing/components/PublishingJobList';
import { usePlatformConnections } from '@/features/home/publishing/hooks/usePlatformConnections';

export default function PublishingScheduleScreen() {
  const theme = useTheme();
  const surface = theme.palette.background.paper;
  const sectionShadow = `0 10px 30px ${alpha(theme.palette.primary.main, 0.08)}`;

  const { connections, serverTime, loading, error, reload: reloadConnections } = usePlatformConnections();
  const [toast, setToast] = useState<string | null>(null);
  const [jobsRefreshKey, setJobsRefreshKey] = useState(0);
  const [selectedConnectionId, setSelectedConnectionId] = useState<number | null>(null);

  const accountTimezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

  useEffect(() => {
    if (!connections.length) {
      setSelectedConnectionId(null);
      return;
    }
    if (selectedConnectionId && connections.some((c) => c.id === selectedConnectionId)) {
      return;
    }
    setSelectedConnectionId(connections[0]?.id ?? null);
  }, [connections, selectedConnectionId]);

  const hasConnections = connections.length > 0;
  const sectionCardSx = {
    borderRadius: 3,
    border: `1px solid ${theme.palette.divider}`,
    p: { xs: theme.spacing(2), md: theme.spacing(3) },
    boxShadow: sectionShadow,
    background:
      theme.palette.mode === 'light'
        ? `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.04)} 0%, ${surface} 35%)`
        : surface,
  };

  return (
    <Stack spacing={{ xs: 2, md: 4 }}>
      <Box
        sx={{
          borderRadius: 4,
          background: `radial-gradient(circle at 15% 20%, ${alpha(
            theme.palette.secondary.main,
            0.16
          )}, transparent 35%), radial-gradient(circle at 80% 0%, ${alpha(
            theme.palette.primary.main,
            0.18
          )}, transparent 40%), ${theme.palette.background.paper}`,
          p: { xs: theme.spacing(2.5), md: theme.spacing(4) },
          border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
          boxShadow: sectionShadow,
        }}
      >
        <Stack spacing={2}>
          <PublishingHeader active="schedule" />
          <Box>
            <Typography variant="h4" fontWeight={800} mb={0.5}>
              Schedule and monitor posts
            </Typography>
            <Typography color="text.secondary" maxWidth={theme.spacing(75)}>
              Queue content against any connected account, with local and server clocks visible to avoid timezone slips.
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="flex-start">
            <Chip
              color="primary"
              variant="outlined"
              label={`Local timezone: ${accountTimezone}`}
              sx={{ fontWeight: 600 }}
            />
            {serverTime && <Chip label={`Server time: ${serverTime}`} variant="outlined" />}
          </Stack>
        </Stack>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Box sx={sectionCardSx}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: theme.spacing(4) }}>
            <CircularProgress />
          </Box>
        ) : hasConnections ? (
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="connection-filter-label">Working account</InputLabel>
              <Select
                labelId="connection-filter-label"
                label="Select the working account"
                value={selectedConnectionId ?? ''}
                onChange={(e) => setSelectedConnectionId(e.target.value ? Number(e.target.value) : null)}
              >
                {connections.map((conn) => (
                  <MenuItem key={conn.id} value={conn.id}>
                    {conn.platformName} - {conn.externalDisplayName || conn.externalUsername || conn.externalAccountId}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <PublishingJobForm
              connections={connections}
              serverTime={serverTime}
              accountTimezone={accountTimezone}
              selectedConnectionId={selectedConnectionId ?? null}
              onCreated={() => {
                void reloadConnections();
                setJobsRefreshKey((k) => k + 1);
                setToast('Post scheduled');
              }}
            />
          </Stack>
        ) : (
          <Alert severity="info">Connect an account first on the Manage accounts tab.</Alert>
        )}
      </Box>

      <Box sx={sectionCardSx}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Publishing jobs
            </Typography>
            <Typography color="text.secondary">
              Recently scheduled posts with status, attempts, and any failure reasons.
            </Typography>
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: theme.spacing(4) }}>
              <CircularProgress />
            </Box>
          ) : (
            <PublishingJobList
              refreshKey={jobsRefreshKey}
              connectionFilter={selectedConnectionId}
              onChanged={() => setJobsRefreshKey((k) => k + 1)}
            />
          )}
        </Stack>
      </Box>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3500}
        onClose={() => setToast(null)}
        message={toast ?? ''}
      />
    </Stack>
  );
}
