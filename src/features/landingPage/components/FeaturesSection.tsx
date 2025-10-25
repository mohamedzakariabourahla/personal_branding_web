'use client';

import React from 'react';
import { Container, Typography, Card, Grid, CardContent } from '@mui/material';

const features = [
  { title: 'AI Video Ideas', text: 'Generate viral TikTok & Reels ideas aligned with your personal brand.' },
  { title: 'Script Generation', text: 'Create engaging video scripts optimized for retention.' },
  { title: 'Carousel Builder', text: 'Design carousels for Instagram with AI-assisted templates.' },
  { title: 'Analytics Dashboard', text: 'Track engagement and learn what performs best.' },
];

export default function FeaturesSection() {
  return (
    <Container sx={{ py: { xs: 10, md: 14 } }}>
      <Typography variant="h4" fontWeight={700} align="center" sx={{ mb: 8 }}>
        What You Can Do
      </Typography>

      <Grid container spacing={4}>
        {features.map((f, i) => (
          <Grid key={i} size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 4,
                boxShadow: 3,
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={600}>
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
  );
}
