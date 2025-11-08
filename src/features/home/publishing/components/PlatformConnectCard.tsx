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
import { px } from 'framer-motion';

type Props = {
  config: PlatformProviderConfig;
  connection?: PlatformConnection;
  onConnect: (providerId: PlatformProviderId) => void;
  onDisconnect?: (connectionId: number) => void;
  isBusy?: boolean;
};

export default function PlatformConnectCard({ config, connection, onConnect, onDisconnect, isBusy }: Props) {
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

    if (!connection) {
      return (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={isBusy}
          onClick={() => onConnect(config.id)}
          startIcon={isBusy ? <CircularProgress size={spinnerSize} color="inherit" /> : null}
        >
          {isBusy ? 'Redirecting...' : 'Connect account'}
        </Button>
      );
    }

    return (
      <Button
        variant="outlined"
        color="inherit"
        fullWidth
        disabled={isBusy}
        onClick={() => connection && onDisconnect?.(connection.id)}
      >
        Disconnect
      </Button>
    );
  };

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        borderRadius: 0,
        borderColor: theme.palette.divider,
        boxShadow: cardShadow,
        backgroundColor: surface,
        display: 'flex',
        flexDirection: 'column',
        px: theme.spacing(1.5)
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
              borderRadius: 0,
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
                backgroundColor: theme.palette.grey[200],
              }}
            />
          )}
        </Stack>

        {connection && (
          <Box
            sx={{
              backgroundColor: theme.palette.background.default,
              borderRadius: 0,
              p: theme.spacing(2),
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
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
