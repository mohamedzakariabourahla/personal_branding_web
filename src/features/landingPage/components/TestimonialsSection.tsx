'use client';

import { Avatar, Grid, Paper, Stack, Typography } from '@mui/material';
import PageContainer from '@/shared/components/layouts/PageContainer';
import Section from '@/shared/components/ui/Section';

const testimonials = [
  {
    name: 'Noah Smith',
    text: 'I grew my TikTok followers 3x in a month using AI-generated ideas.',
  },
  {
    name: 'Emma Lee',
    text: 'The AI scripts and carousels are like having a creative team on demand.',
  },
  {
    name: 'Carlos Rivas',
    text: 'Finally focusing on creating, not brainstorming all day.',
  },
];

export default function TestimonialsSection() {
  return (
    <PageContainer>
      <Section title="What Creators Say">
        <Grid container spacing={4}>
          {testimonials.map((t, i) => (
            <Grid key={i} size={{ xs: 12, md: 4 }}>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 3,
                  height: '100%',
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                }}
              >
                <Stack spacing={2} alignItems="center">
                  <Avatar
                    src={`/avatars/user${i + 1}.png`}
                    alt={t.name}
                    sx={{ width: 56, height: 56 }}
                  />
                  <Typography variant="body1" color="text.primary">
                    “{t.text}”
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {t.name}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Section>
    </PageContainer>
  );
}
