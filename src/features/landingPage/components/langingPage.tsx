'use client';

import React from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <>
      {/* HERO SECTION */}
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
              gutterBottom
              sx={{
                fontSize: { xs: '2.4rem', md: '3.5rem' },
                lineHeight: 1.2,
              }}
            >
              Build your personal brand faster with AI.
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mt: 2, mb: 5, maxWidth: 600, mx: 'auto' }}
            >
              Turn your ideas into polished social content, personal websites,
              and campaigns — all powered by intelligent automation.
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button variant="contained" color="secondary" size="large">
                Get Started
              </Button>
              <Button variant="outlined" color="secondary" size="large">
                Learn More
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* FEATURES SECTION */}
      <Container sx={{ py: { xs: 10, md: 14 } }}>
        <Typography
          variant="h4"
          fontWeight={700}
          align="center"
          gutterBottom
          sx={{ mb: 8 }}
        >
          Powerful features to grow your brand
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              title: 'AI-Powered Content',
              text: 'Generate stunning posts, bios, and website copy tailored to your audience in seconds.',
            },
            {
              title: 'Personal Portfolio Builder',
              text: 'Create a beautiful personal website without touching a line of code.',
            },
            {
              title: 'Analytics Dashboard',
              text: 'Track engagement, growth, and insights across your platforms.',
            },
          ].map((f, i) => (
            <Grid key={i} size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  p: 2,
                  borderRadius: 4,
                  boxShadow: 3,
                  bgcolor: (theme) =>
                    theme.palette.mode === 'light'
                      ? '#ffffff'
                      : 'rgba(255, 255, 255, 0.05)',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    sx={{ mb: 1 }}
                  >
                    {f.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {f.text}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* TESTIMONIALS */}
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? '#f9fafb' : '#1e293b',
          py: { xs: 10, md: 14 },
        }}
      >
        <Container>
          <Typography
            variant="h4"
            fontWeight={700}
            align="center"
            gutterBottom
            sx={{ mb: 8 }}
          >
            What our users say
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                name: 'Alex Johnson',
                text: 'This tool saved me hours every week! I grew my audience faster than ever.',
                avatar: '/avatars/avatar1.png',
              },
              {
                name: 'Sophia Chen',
                text: 'A must-have for creators. The AI content feels personal and authentic.',
                avatar: '/avatars/avatar2.png',
              },
              {
                name: 'Liam Patel',
                text: 'Clean, modern, and smart — everything I wanted in a branding platform.',
                avatar: '/avatars/avatar3.png',
              },
            ].map((t, i) => (
              <Grid key={i} size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    p: 3,
                    boxShadow: 3,
                    textAlign: 'center',
                    bgcolor: (theme) =>
                      theme.palette.mode === 'light'
                        ? '#ffffff'
                        : 'rgba(255,255,255,0.05)',
                  }}
                >
                  <Avatar
                    src={t.avatar}
                    sx={{ width: 64, height: 64, mx: 'auto', mb: 2 }}
                  />
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {t.text}
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {t.name}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          py: 6,
          textAlign: 'center',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? '#111827' : '#0f172a',
          color: '#fff',
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Personal Branding SaaS. All rights
          reserved.
        </Typography>
      </Box>
    </>
  );
}
