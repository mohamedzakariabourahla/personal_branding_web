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

const PUBLIC_NAV: NavItem[] = [
  { label: 'Features', href: '/landingPage#features' },
  { label: 'How it works', href: '/landingPage#how-it-works' },
  { label: 'Testimonials', href: '/landingPage#testimonials' },
  { label: 'Contact', href: '/landingPage#contact' },
];

const CREATOR_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/home/dashboard' },
  { label: 'Content Creation', href: '/home/contentCreation' },
  { label: 'Publishing', href: '/home/publishing' },
  { label: 'Profile & Settings', href: '/home/profileAndSetting' },
];

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();

  // 🔒 Later: connect this to your AuthProvider
  const isAuthenticated = false;

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const toggleDrawer = (open: boolean) => () => setDrawerOpen(open);

  const navItems = isAuthenticated ? CREATOR_NAV : PUBLIC_NAV;

  const renderNavButton = (item: NavItem) => {
    const isActive = pathname?.startsWith(item.href);
    return (
      <Button
        key={item.href}
        component={Link}
        href={item.href}
        sx={{
          color: isActive
            ? theme.palette.primary.main
            : theme.palette.text.primary,
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
        backgroundColor: theme.palette.background.paper,
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 1,
          }}
        >
          {/* ✅ Logo */}
          <Box
            component={Link}
            href="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                letterSpacing: '-0.5px',
              }}
            >
              PersonalBranding
            </Typography>
            <Typography
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 700,
                ml: 0.5,
              }}
            >
              AI
            </Typography>
          </Box>

          {/* ✅ Desktop Menu */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {navItems.map(renderNavButton)}

              {!isAuthenticated ? (
                <>
                  <Button
                    component={Link}
                    href="/register"
                    variant="contained"
                    color="primary"
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Get Started
                  </Button>
                  <Button
                    component={Link}
                    href="/login"
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      px: 2.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: theme.palette.divider,
                    }}
                  >
                    Sign In
                  </Button>
                </>
              ) : (
                <Button
                  component={Link}
                  href="/home/profileAndSetting"
                  variant="text"
                  sx={{
                    color: theme.palette.text.primary,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Account
                </Button>
              )}

              <ThemeToggle />
            </Box>
          )}

          {/* ✅ Mobile Menu */}
          {isMobile && (
            <>
              <IconButton
                edge="end"
                color="inherit"
                onClick={toggleDrawer(true)}
                aria-label="menu"
              >
                <MenuIcon />
              </IconButton>

              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                <Box
                  sx={{ width: 260 }}
                  role="presentation"
                  onClick={toggleDrawer(false)}
                  onKeyDown={toggleDrawer(false)}
                >
                  <List>
                    {navItems.map((item) => (
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
                            <ListItemText primary="Sign In" />
                          </ListItemButton>
                        </ListItem>
                      </>
                    ) : (
                      <ListItem disablePadding>
                        <ListItemButton
                          component={Link}
                          href="/home/profileAndSetting"
                        >
                          <ListItemText primary="Account" />
                        </ListItemButton>
                      </ListItem>
                    )}

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        p: 2,
                      }}
                    >
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
