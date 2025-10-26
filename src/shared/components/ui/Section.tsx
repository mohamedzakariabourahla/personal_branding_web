'use client';

import { Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

export default function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <Stack spacing={6} alignItems="center">
      <Stack spacing={1} textAlign="center">
        <Typography variant="h4" fontWeight={700}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="subtitle1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Stack>
      {children}
    </Stack>
  );
}
