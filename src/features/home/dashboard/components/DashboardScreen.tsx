'use client';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Card, CardContent, Stack, Typography, Grid } from '@mui/material';

const STAT_CARDS = [
  { label: 'Planned posts', value: '24', helper: 'scheduled across all channels' },
  { label: 'Avg. engagement', value: '6.4%', helper: 'last 30 days (TikTok beta)' },
  { label: 'Audience growth', value: '+812', helper: 'net new followers this month' },
];

const WHATS_NEXT = [
  'Record a 45s "market update" reel - TikTok spikes tonight.',
  "Repurpose last week's carousel into a YouTube Short.",
  'Schedule two testimonial posts for Sunday morning.',
];

const SCHEDULED_WINDOWS = ['1-10 Aug', '11-20 Aug', '21-30 Aug'];
const SCHEDULED_BARS = [6, 8, 12];

export default function DashboardScreen() {
  const theme = useTheme();
  const surface = theme.palette.background.paper;
  const statCardShadow = `0 6px 20px ${alpha(theme.palette.primary.main, 0.12)}`;
  const barGradient = `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${alpha(
    theme.palette.secondary.main,
    0.8,
  )} 100%)`;
  const radius = /*theme.shape.borderRadius*/ 0;

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Performance snapshot
            </Typography>
            <Typography color="text.secondary" maxWidth={theme.spacing(80)} mt={theme.spacing(0.5)}>
              Track everything from one command center. TikTok metrics are live while Meta and YouTube insights will
              appear as soon as their connectors are approved.
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Statistic
            </Typography>
            <Grid container spacing={{ xs: 1.5, sm: 2 }}>
              {STAT_CARDS.map((metric) => (
                <Grid key={metric.label} size={{ xs: 12, sm: 4 }}>
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: radius,
                      backgroundColor: surface,
                      boxShadow: statCardShadow,
                    }}
                  >
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {metric.label}
                      </Typography>
                      <Typography variant="h4" fontWeight={800}>
                        {metric.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {metric.helper}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Card variant="outlined" sx={{ borderRadius: radius , boxShadow: statCardShadow,}}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Scheduled posts (last 30 days)
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: theme.spacing(3),
                  alignItems: "flex-end",
                  height: theme.spacing(20),
                  px: theme.spacing(2),
                }}
              >
                {SCHEDULED_BARS.map((value, idx) => (
                  <Box key={SCHEDULED_WINDOWS[idx]} sx={{ textAlign: "center", flex: 1}}>
                    <Box
                      sx={{
                        height: theme.spacing(value),
                        borderRadius: radius,
                        backgroundImage: barGradient,
                      }}
                    />
                    <Typography variant="caption" display="block" mt={theme.spacing(1)}>
                      {SCHEDULED_WINDOWS[idx]}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card
          variant="outlined"
          sx={{
            borderRadius: radius,
            backgroundColor: surface,
            boxShadow: statCardShadow,
          }}
        >
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              What&apos;s next?
            </Typography>
            <Stack spacing={1.5}>
              {WHATS_NEXT.map((item, index) => (
                <Box
                  key={item}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: radius,
                    p: theme.spacing(1.5),
                    backgroundColor: surface,
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    Step {index + 1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
