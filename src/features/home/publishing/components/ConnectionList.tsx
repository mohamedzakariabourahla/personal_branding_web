'use client';

import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import { PlatformConnection } from '@/features/home/publishing/models/platformModels';

type Props = {
  connections: PlatformConnection[];
  onDisconnect: (connectionId: number) => void;
  busyId?: number | null;
};

function EmptyState() {
  return (
    <Box
      sx={(theme) => ({
        border: `1px dashed ${theme.palette.divider}`,
        borderRadius: 0,
        p: theme.spacing(3),
        textAlign: 'center',
      })}
    >
      <Typography variant="subtitle1" fontWeight={600}>
        No accounts connected yet
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Connect TikTok, Instagram, or YouTube to unlock scheduling and analytics.
      </Typography>
    </Box>
  );
}

export default function ConnectionList({ connections, onDisconnect, busyId }: Props) {
  if (connections.length === 0) {
    return <EmptyState />;
  }

  return (
    <List
      sx={(theme) => ({
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 0,
        p: 0,
      })}
    >
      {connections.map((connection) => {
        const initials = (connection.externalDisplayName || connection.externalUsername || '?')
          .split(' ')
          .map((part) => part.charAt(0))
          .slice(0, 2)
          .join('')
          .toUpperCase();

        const syncedLabel = connection.lastSyncedAt
          ? new Date(connection.lastSyncedAt).toLocaleString()
          : null;

        return (
          <ListItem
            key={connection.id}
            divider
            secondaryAction={
              <Tooltip title="Disconnect account">
                <span>
                  <IconButton edge="end" onClick={() => onDisconnect(connection.id)} disabled={busyId === connection.id}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </span>
              </Tooltip>
            }
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'primary.main' }}>{initials}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography fontWeight={600}>{connection.externalDisplayName || connection.externalUsername}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {connection.platformName}
                  </Typography>
                </Box>
              }
              secondary={
                <Typography component="span" variant="body2" color="text.secondary">
                  ID: {connection.externalAccountId}
                  {syncedLabel && (
                    <>
                      {' - '}
                      <SyncOutlinedIcon fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      Last synced {syncedLabel}
                    </>
                  )}
                </Typography>
              }
            />
          </ListItem>
        );
      })}
    </List>
  );
}
