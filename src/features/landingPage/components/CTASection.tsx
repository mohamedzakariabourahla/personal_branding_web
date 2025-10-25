'use client';

import { Box, Button, Container, Typography } from '@mui/material';

export default function CTASection() {
    return (
        <Box
        sx={{
          py: 12,
          textAlign: 'center',
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'linear-gradient(180deg, #111827 0%, #1f2937 100%)'
              : 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          color: '#fff',
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h4"
            fontWeight={700}
            gutterBottom
            sx={{ mb: 3 }}
          >
            Ready to grow your social presence?
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            href="/register"
          >
            Start Now
          </Button>
        </Container>
      </Box>
    );
}