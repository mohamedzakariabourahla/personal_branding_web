'use client';

import React from 'react';
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

const navItems = ['Features', 'Pricing', 'Testimonials', 'Contact'];

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor:
          theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.8)'
            : 'rgba(13, 17, 23, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${
          theme.palette.mode === 'light' ? '#e5e7eb' : '#2d333b'
        }`,
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
          {/* ✅ Logo / Brand Name */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              letterSpacing: '-0.5px',
            }}
          >
            PersonalBranding<span style={{ color: theme.palette.primary.main }}>AI</span>
          </Typography>

          {/* ✅ Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {navItems.map((item) => (
                <Button
                  key={item}
                  sx={{
                    color: theme.palette.text.primary,
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {item}
                </Button>
              ))}
              <Button
                variant="contained" 
                color="secondary"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Get Started
              </Button>
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
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </IconButton>

              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                <Box sx={{ width: 250, p: 2 }}>
                  <List>
                    {navItems.map((item) => (
                      <ListItem key={item} disablePadding>
                        <ListItemButton>
                          <ListItemText primary={item} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemText primary="Get Started" />
                      </ListItemButton>
                    </ListItem>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
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
