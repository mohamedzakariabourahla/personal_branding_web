'use client';

import { Box, Container, Stack, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ py: 4, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
      <Container>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} PersonalBrandingAI. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={3}>
            <Link href="#" color="text.secondary" underline="hover">
              Home
            </Link>
            <Link href="#" color="text.secondary" underline="hover">
              Pricing
            </Link>
            <Link href="#" color="text.secondary" underline="hover">
              Privacy
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
