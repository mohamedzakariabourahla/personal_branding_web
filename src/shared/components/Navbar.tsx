// src/shared/components/Navbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ThemeToggle from '@/shared/components/ThemeToggle';

type NavItem = { label: string; href: string };

const publicNav: NavItem[] = [
  { label: 'Features', href: '/landingPage#features' },
  { label: 'How it works', href: '/landingPage#how-it-works' },
  { label: 'Testimonials', href: '/landingPage#testimonials' },
  { label: 'Contact', href: '/landingPage#contact' },
];

const authNavForCreators: NavItem[] = [
  { label: 'Dashboard', href: '/home/dashboard' },
  { label: 'Create', href: '/home/contentCreation' },
  { label: 'Analytics', href: '/home/dashboard' },
  { label: 'Publishing', href: '/home/publishing' },
];

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();

  // TODO: replace with real auth state from your AuthProvider (useAuth hook)
  const isAuthenticated = false; // e.g. const { isAuthenticated } = useAuth();

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const toggleDrawer = (open: boolean) => () => setDrawerOpen(open);

  const desktopNav = isAuthenticated ? authNavForCreators : publicNav;

  const renderNavButton = (item: NavItem) => {
    const isActive = pathname?.startsWith(item.href);
    return (
      <Button
        key={item.href}
        component={Link}
        href={item.href}
        sx={{
          color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
          textTransform: 'none',
          fontWeight: 500,
          '&:hover': { color: theme.palette.primary.main },
        }}
      >
        {item.label}
      </Button>
    );
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor:
          theme.palette.mode === 'light'
            ? 'rgba(255,255,255,0.8)'
            : 'rgba(13,17,23,0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${
          theme.palette.mode === 'light' ? '#e5e7eb' : '#2d333b'
        }`,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
          {/* Logo / Brand */}
          <Box component={Link} href="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                letterSpacing: '-0.5px',
                mr: 1,
              }}
            >
              PersonalBranding
            </Typography>
            <Typography sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>AI</Typography>
          </Box>

          {/* Desktop nav */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {desktopNav.map(renderNavButton)}

              {!isAuthenticated ? (
                <>
                  <Button
                    component={Link}
                    href="/register"
                    variant="contained"
                    color="secondary"
                    sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}
                  >
                    Get Started
                  </Button>
                  <Button
                    component={Link}
                    href="/login"
                    variant="text"
                    sx={{ color: theme.palette.text.primary, textTransform: 'none', fontWeight: 600 }}
                  >
                    Sign in
                  </Button>
                </>
              ) : (
                <Button
                  component={Link}
                  href="/home/profileAndSetting"
                  variant="text"
                  sx={{ color: theme.palette.text.primary, textTransform: 'none', fontWeight: 600 }}
                >
                  Account
                </Button>
              )}

              <ThemeToggle />
            </Box>
          )}

          {/* Mobile nav */}
          {isMobile && (
            <>
              <IconButton edge="end" color="inherit" onClick={toggleDrawer(true)} aria-label="open menu">
                <MenuIcon />
              </IconButton>

              <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box sx={{ width: 280 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
                  <List>
                    {(isAuthenticated ? authNavForCreators : publicNav).map((item) => (
                      <ListItem key={item.href} disablePadding>
                        <ListItemButton component={Link} href={item.href}>
                          <ListItemText primary={item.label} />
                        </ListItemButton>
                      </ListItem>
                    ))}

                    {!isAuthenticated ? (
                      <>
                        <ListItem disablePadding>
                          <ListItemButton component={Link} href="/register">
                            <ListItemText primary="Get Started" />
                          </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                          <ListItemButton component={Link} href="/login">
                            <ListItemText primary="Sign in" />
                          </ListItemButton>
                        </ListItem>
                      </>
                    ) : (
                      <ListItem disablePadding>
                        <ListItemButton component={Link} href="/home/profileAndSetting">
                          <ListItemText primary="Account" />
                        </ListItemButton>
                      </ListItem>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      <ThemeToggle />
                    </Box>
                  </List>
                </Box>
              </Drawer>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
