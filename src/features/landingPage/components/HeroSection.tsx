'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <Box
      sx={{
        background: (theme) =>
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)'
            : 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        py: { xs: 10, md: 14 },
        textAlign: 'center',
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            fontWeight={700}
            sx={{ fontSize: { xs: '2.4rem', md: '3.5rem' } }}
          >
            Grow your TikTok & Instagram brand with AI.
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mt: 2, mb: 5, maxWidth: 600, mx: 'auto' }}
          >
            Generate viral content ideas, captions, and carousels instantly —
            tailored to your audience.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" color="secondary" href="/register">
              Get Started
            </Button>
            <Button variant="outlined" color="secondary" href="/onboarding">
              Try Demo
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
