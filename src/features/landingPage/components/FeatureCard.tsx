'use client';

import { Paper, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

export default function FeatureCard({
  icon,
  title,
  description,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 4,
        borderRadius: 3,
        height: '100%',
        transition: '0.3s ease',
        bgcolor: 'background.paper',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <Stack spacing={2} alignItems="center" textAlign="center">
        {icon}
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Stack>
    </Paper>
  );
}
