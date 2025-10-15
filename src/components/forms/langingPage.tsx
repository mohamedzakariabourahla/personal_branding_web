'use client';

import * as React from 'react';
import { useState } from 'react';
import Head from 'next/head';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  IconButton,
  Link as MuiLink,
  Card,
  CardContent,
  CardActions,
  Avatar,
  useMediaQuery,
  CssBaseline,
  ThemeProvider,
  createTheme,
  PaletteMode,
  Switch,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import MenuIcon from '@mui/icons-material/Menu';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { motion } from 'framer-motion';

function getTheme(mode: PaletteMode = 'light') {
  return createTheme({
    palette: {
      mode,
      primary: { main: '#1976d2' },
      background: { default: mode === 'light' ? '#f7f9fc' : '#0b1020' },
    },
    typography: {
      fontFamily: 'Inter, Roboto, Arial, sans-serif',
    },
  });
}

const AnimatedSection: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6 }}
  >
    {children}
  </motion.div>
);

const Navbar: React.FC<{ onToggleDark: () => void; mode: PaletteMode }> = ({ onToggleDark, mode }) => {
  const isSm = useMediaQuery('(max-width:600px)');
  return (
    <AppBar position="sticky" color="transparent" sx={{ backdropFilter: 'blur(6px)', mt: 2 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 36, height: 36, bgcolor: 'primary.main', borderRadius: 1.2 }} />
          <Typography variant="h6">Brandly</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {!isSm && (
            <>
              <MuiLink href="#features" underline="none" color="text.primary">
                Features
              </MuiLink>
              <MuiLink href="#pricing" underline="none" color="text.primary">
                Pricing
              </MuiLink>
              <MuiLink href="#testimonials" underline="none" color="text.primary">
                Testimonials
              </MuiLink>
            </>
          )}
          <Switch checked={mode === 'dark'} onChange={onToggleDark} />
          <Button variant="contained">Get Started</Button>
          {isSm && (
            <IconButton aria-label="menu">
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const Hero: React.FC = () => (
  <AnimatedSection>
    <Container sx={{ py: 8 }}>
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h2" gutterBottom fontWeight={700}>
            Build your personal brand effortlessly
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Create a stunning portfolio, automate content, and measure your growth — all in one place.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button variant="contained" size="large">Start Free Trial</Button>
            <Button variant="outlined" size="large">Book Demo</Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mt: 4, alignItems: 'center' }}>
            <StarIcon />
            <Typography>Trusted by agencies and creators</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ width: '100%', height: 340, borderRadius: 3, bgcolor: 'background.paper', boxShadow: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography color="text.secondary">[Mockup / Illustration]</Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  </AnimatedSection>
);

const features = [
  { title: 'Portfolio Builder', desc: 'Create beautiful personal portfolios.', icon: '🎨' },
  { title: 'Content Scheduler', desc: 'Plan and automate posts across platforms.', icon: '📆' },
  { title: 'Analytics Dashboard', desc: 'Understand what works with your metrics.', icon: '📈' },
];

const Features: React.FC = () => (
  <AnimatedSection>
    <Container id="features" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom fontWeight={700} textAlign="center">
        All the tools you need
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        From landing pages to analytics — everything for your personal brand.
      </Typography>
      <Grid container spacing={3}>
        {features.map((f) => (
          <Grid item xs={12} md={4} key={f.title}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent>
                <Box sx={{ fontSize: 36 }}>{f.icon}</Box>
                <Typography variant="h6" mt={1}>{f.title}</Typography>
                <Typography color="text.secondary" mt={1}>{f.desc}</Typography>
              </CardContent>
              <CardActions sx={{ mt: 'auto' }}>
                <Button size="small">Learn more</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </AnimatedSection>
);

const testimonials = [
  { name: 'Sara Ahmed', role: 'Freelance Designer', quote: 'Brandly helped me 3x my client leads in 2 months.' },
  { name: 'Omar Ben', role: 'Agency Owner', quote: 'We onboarded clients faster using the portfolio templates.' },
];

const Testimonials: React.FC = () => (
  <AnimatedSection>
    <Container id="testimonials" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
        What our users say
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {testimonials.map((t) => (
          <Grid item xs={12} md={6} key={t.name}>
            <Card>
              <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>{t.name[0]}</Avatar>
                <Box>
                  <Typography fontWeight={700}>{t.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{t.role}</Typography>
                </Box>
              </CardContent>
              <Divider />
              <CardContent>
                <Typography>“{t.quote}”</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </AnimatedSection>
);

const plans = [
  { name: 'Starter', price: '$9', period: '/mo', bullets: ['1 site', 'Basic analytics', 'Email support'] },
  { name: 'Pro', price: '$29', period: '/mo', bullets: ['5 sites', 'Advanced analytics', 'Priority support'], featured: true },
  { name: 'Agency', price: '$99', period: '/mo', bullets: ['Unlimited sites', 'Team seats', 'Dedicated support'] },
];

const Pricing: React.FC = () => (
  <AnimatedSection>
    <Container id="pricing" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
        Pricing
      </Typography>
      <Typography color="text.secondary" align="center" sx={{ mb: 3 }}>
        Simple pricing that scales with your brand.
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {plans.map((p) => (
          <Grid item xs={12} md={4} key={p.name}>
            <Card sx={{ p: 2, border: p.featured ? '2px solid' : undefined, borderColor: p.featured ? 'primary.main' : undefined }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700}>{p.name}</Typography>
                <Typography variant="h4" mt={1} mb={1}>
                  {p.price}
                  <Typography component="span" fontSize={16} color="text.secondary">{p.period}</Typography>
                </Typography>
                {p.bullets.map((b) => (
                  <Box key={b} sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                    <CheckCircleIcon fontSize="small" />
                    <Typography>{b}</Typography>
                  </Box>
                ))}
              </CardContent>
              <CardActions>
                <Button fullWidth variant={p.featured ? 'contained' : 'outlined'}>
                  {p.featured ? 'Start Pro' : 'Choose'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </AnimatedSection>
);

const Footer: React.FC = () => (
  <Box component="footer" sx={{ py: 6, bgcolor: 'background.paper', mt: 6 }}>
    <Container>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Brandly</Typography>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Brandly — Build your personal brand.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <IconButton><FacebookIcon /></IconButton>
            <IconButton><TwitterIcon /></IconButton>
            <IconButton><LinkedInIcon /></IconButton>
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default function LandingPage() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<PaletteMode>(prefersDark ? 'dark' : 'light');
  const theme = React.useMemo(() => getTheme(mode), [mode]);
  return (
    <>
      <Head>
        <title>Brandly — Personal Branding Platform</title>
        <meta name="description" content="Build and manage your personal brand with Brandly" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Navbar onToggleDark={() => setMode((m) => (m === 'light' ? 'dark' : 'light'))} mode={mode} />
          <main>
            <Hero />
            <Features />
            <Testimonials />
            <Pricing />
          </main>
          <Footer />
        </Box>
      </ThemeProvider>
    </>
  );
}
