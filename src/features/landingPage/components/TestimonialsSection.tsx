'use client';

import { Container, Grid, Typography, Card, Avatar, Box } from '@mui/material';

const testimonials = [
  {
    name: 'Noah Smith',
    text: 'I grew my TikTok followers 3x in a month using AI-generated ideas.',
    avatar: '/avatars/avatar1.png',
  },
  {
    name: 'Emma Lee',
    text: 'The AI captions and scripts are like having a creative team on demand.',
    avatar: '/avatars/avatar2.png',
  },
  {
    name: 'Carlos Rivera',
    text: 'Finally focusing on creating, not brainstorming all day!',
    avatar: '/avatars/avatar3.png',
  },
];

export default function TestimonialsSection() {
  return (
    <Box sx={{ backgroundColor: (t) => t.palette.background.default, py: 14 }}>
      <Container>
        <Typography
          variant="h4"
          fontWeight={700}
          align="center"
          sx={{ mb: 8 }}
        >
          What Creators Say
        </Typography>

        <Grid container spacing={4}>
          {testimonials.map((t, i) => (
            <Grid key={i} size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
                <Avatar src={t.avatar} sx={{ width: 64, height: 64, mx: 'auto', mb: 2 }} />
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
  );
}
