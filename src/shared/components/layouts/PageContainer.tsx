'use client';

import { Box, Container } from '@mui/material';
import { ReactNode } from 'react';

export default function PageContainer({
  children,
  bgcolor,
}: {
  children: ReactNode;
  bgcolor?: string;
}) {
  return (
    <Box sx={{ bgcolor, py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">{children}</Container>
    </Box>
  );
}
