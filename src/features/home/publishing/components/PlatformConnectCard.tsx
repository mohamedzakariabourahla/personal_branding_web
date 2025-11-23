'use client';

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  PlatformConnection,
  PlatformProviderConfig,
  PlatformProviderId,
} from '@/features/home/publishing/models/platformModels';

type Props = {
  config: PlatformProviderConfig;
  connections?: PlatformConnection[];
  onConnect: (providerId: PlatformProviderId) => void;
  onDisconnect?: (connectionId: number) => void;
  isBusy?: boolean;
};

export default function PlatformConnectCard({ config, connections = [], onConnect, onDisconnect, isBusy }: Props) {
  const theme = useTheme();
  const accentColor = config.accent || theme.palette.primary.main;
  const accentContrast = theme.palette.getContrastText(accentColor);
  const avatarSize = theme.spacing(5.5);
  const spinnerSize = Number.parseFloat(theme.spacing(2.25));
  const surface = theme.palette.background.paper;
  const cardShadow = `0 10px 30px ${alpha(theme.palette.primary.main, 0.08)}`;

  const renderAction = () => {
    if (config.disabled) {
      return (
        <Button variant="outlined" fullWidth disabled>
          Coming soon
        </Button>
      );
    }

    return (
      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={isBusy}
        onClick={() => onConnect(config.id)}
        startIcon={isBusy ? <CircularProgress size={spinnerSize} color="inherit" /> : null}
      >
        {isBusy ? 'Redirecting...' : connections.length > 0 ? 'Connect another account' : 'Connect account'}
      </Button>
    );
  };

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        borderRadius: theme.spacing(0),
        borderColor: theme.palette.divider,
        boxShadow: cardShadow,
        backgroundColor: surface,
        display: 'flex',
        flexDirection: 'column',
        px: { xs: theme.spacing(2), sm: theme.spacing(3) },
        py: theme.spacing(2),
      }}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(3),
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: theme.spacing(1),
              backgroundColor: accentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accentContrast,
              fontWeight: 700,
              fontSize: theme.typography.pxToRem(18),
            }}
          >
            {config.name.charAt(0)}
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              {config.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {config.description}
            </Typography>
          </Box>
          
          {config.badge && (
            <Chip
              label={config.badge}
              size="small"
              sx={{
                ml: 'auto',
                fontWeight: 600,
              }}
            />
          )}
        </Stack>

        {connections.length > 0 && (
          <Stack spacing={1.25}>
            {connections.map((connection) => (
              <Box
                key={connection.id}
                sx={{
                  backgroundColor: theme.palette.background.default,
                  borderRadius: theme.spacing(1.5),
                  p: theme.spacing(2),
                  border: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: theme.spacing(2),
                }}
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Connected as
                  </Typography>
                  <Typography variant="body1">
                    {connection.externalDisplayName || connection.externalUsername || connection.externalAccountId}
                  </Typography>
                  {connection.lastSyncedAt && (
                    <Typography variant="caption" color="text.secondary">
                      Last synced {new Date(connection.lastSyncedAt).toLocaleString()}
                    </Typography>
                  )}
                </Box>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  disabled={isBusy}
                  onClick={() => onDisconnect?.(connection.id)}
                >
                  Disconnect
                </Button>
              </Box>
            ))}
          </Stack>
        )}

        <Box sx={{ mt: 'auto' }}>
          {config.betaNote && (
            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
              {config.betaNote}
            </Typography>
          )}
          <Tooltip title={config.disabled ? 'Platform access unlocks soon.' : ''} placement="top">
            <span>{renderAction()}</span>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}
