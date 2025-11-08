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
import { useTheme } from '@mui/material/styles';
import {
  PlatformConnection,
  PlatformProviderConfig,
} from '@/features/home/publishing/models/platformModels';

type Props = {
  config: PlatformProviderConfig;
  connection?: PlatformConnection;
  onConnect: (providerId: string) => void;
  onDisconnect?: (connectionId: number) => void;
  isBusy?: boolean;
};

export default function PlatformConnectCard({ config, connection, onConnect, onDisconnect, isBusy }: Props) {
  const theme = useTheme();
  const hasConnection = Boolean(connection);
  const buttonDisabled = config.disabled || (hasConnection && !onDisconnect);
  const accentColor = config.accent || theme.palette.primary.main;
  const accentContrast = theme.palette.getContrastText(accentColor);
  const avatarSize = theme.spacing(5.5);
  const spinnerSize = Number.parseFloat(theme.spacing(2.25));

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        borderRadius: theme.shape.borderRadius,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(2),
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: theme.shape.borderRadius * 1.5,
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
          <Box>
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
                backgroundColor:
                  config.badge === 'Available'
                    ? 'success.light'
                    : config.badge === 'In Review'
                      ? 'warning.light'
                      : 'grey.200',
              }}
            />
          )}
        </Stack>

        {hasConnection && connection && (
          <Box
            sx={{
              backgroundColor: 'background.default',
              borderRadius: theme.shape.borderRadius,
              p: theme.spacing(2),
              border: '1px solid',
              borderColor: 'divider',
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
          <Tooltip
            title={config.disabled ? 'This connector will be enabled once partner review is complete.' : ''}
            placement="top"
          >
            <span>
              {!hasConnection ? (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={buttonDisabled || isBusy}
                  onClick={() => onConnect(config.id)}
                  startIcon={isBusy ? <CircularProgress size={spinnerSize} color="inherit" /> : null}
                >
                  {isBusy ? 'Redirecting...' : 'Connect account'}
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="inherit"
                  fullWidth
                  disabled={isBusy}
                  onClick={() => onDisconnect?.(connection.id)}
                >
                  Disconnect
                </Button>
              )}
            </span>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}
