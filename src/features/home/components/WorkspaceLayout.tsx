'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  AppBar,
  Avatar,
  Box,
  ButtonBase,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { useEffect, useMemo, useState } from 'react';
import ThemeToggle from '@/shared/components/ThemeToggle';
import { useAuthSession } from '@/shared/providers/AuthSessionProvider';
import { SideNavLink } from '@/shared/components/layouts/SideNavigation';
import WorkspaceDrawer from '@/shared/components/layouts/WorkspaceDrawer';

const MAIN_LINKS: SideNavLink[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <SpaceDashboardOutlinedIcon /> },
  { label: 'Publishing', href: '/publishing', icon: <RocketLaunchOutlinedIcon /> },
  { label: 'Content Studio', href: '/contentCreation', icon: <AutoAwesomeOutlinedIcon /> },
  { label: 'Learning & Support', href: '/learningAndSupport', icon: <SchoolOutlinedIcon /> },
];

const SETTINGS_LINK: SideNavLink = { label: 'Profile & Settings', href: '/profileAndSetting', icon: null };

type Props = {
  children: React.ReactNode;
};

export default function WorkspaceLayout({ children }: Props) {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthSession();
  const personName = user?.person?.fullName?.trim();
  const displayName = personName || user?.email || 'Profile';
  const initials = personName
    ? personName
        .split(' ')
        .map((part) => part.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || 'U';
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isXlUp = useMediaQuery(theme.breakpoints.up('xl'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const selectedHref = useMemo(() => {
    if (!pathname) return '';
    const match = [...MAIN_LINKS, SETTINGS_LINK].find((nav) => pathname.startsWith(nav.href));
    return match?.href ?? '';
  }, [pathname]);

  const toggleDrawer = () => setMobileOpen((open) => !open);

  const toggleCollapse = () => {
    if (isMobile) {
      setCollapsed(false);
      return;
    }
    setCollapsed((prev) => !prev);
  };

  const baseDrawerWidth = useMemo(() => {
    if (isSmall) return theme.spacing(24);
    if (isTablet) return theme.spacing(26);
    if (isXlUp) return theme.spacing(34);
    return theme.spacing(30);
  }, [isSmall, isTablet, isXlUp, theme]);

  const drawerWidth = !isMobile && collapsed ? theme.spacing(10) : baseDrawerWidth;

  const contentMaxWidth = isXlUp
    ? `${theme.breakpoints.values.xl}px`
    : `${theme.breakpoints.values.lg}px`;

  const contentPaddingX = useMemo(
    () => ({
      xs: theme.spacing(1.5),
      sm: theme.spacing(2),
      md: theme.spacing(3),
      lg: theme.spacing(4),
      xl: theme.spacing(5),
    }),
    [theme],
  );

  const contentPaddingY = useMemo(
    () => ({
      xs: theme.spacing(1.5),
      sm: theme.spacing(2),
      md: theme.spacing(2.5),
      lg: theme.spacing(3),
      xl: theme.spacing(4),
    }),
    [theme],
  );


  const avatarSize = isXlUp ? theme.spacing(4.5) : isSmall ? theme.spacing(3.5) : theme.spacing(4);
  const surfaceColor = theme.palette.background.paper;
  const shellBackground =
    theme.palette.mode === 'light'
      ? theme.palette.grey[50]
      : theme.palette.background.default;

  useEffect(() => {
    if (isMobile && collapsed) {
      setCollapsed(false);
    }
  }, [isMobile, collapsed]);

  const drawerContent = (
    <WorkspaceDrawer
      links={MAIN_LINKS}
      selectedHref={selectedHref}
      onSelectSettings={() => router.push(SETTINGS_LINK.href)}
      onLogout={logout}
      supportEmail="support@uppersona.app"
      surfaceColor={surfaceColor}
      brand={{ name: 'UpPersona', logoSrc: '/assets/logo.svg', logoAlt: 'UpPersona logo', logoSize: 28 }}
      collapsed={collapsed && !isMobile}
      onToggleCollapse={!isMobile ? toggleCollapse : undefined}
    />
  );

  return (
    <Box sx={{ display: 'flex', backgroundColor: shellBackground }}>
      <Box
        component="nav"
        sx={{
          width: { lg: drawerWidth },
          flexShrink: { lg: 0 },
        }}
        aria-label="workspace navigation"
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={toggleDrawer}
          ModalProps={{ keepMounted: true }}
          PaperProps={{ elevation: 4 }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
              backgroundColor: surfaceColor,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          backgroundColor: shellBackground,
        }}
      >
        {isMobile && (
          <AppBar
            position="sticky"
            elevation={0}
            sx={{ backgroundColor: theme.palette.background.paper, borderBottom: `1px solid ${theme.palette.divider}` }}
          >
            <Toolbar>
              <IconButton edge="start" onClick={toggleDrawer} sx={{ mr: 2 }} aria-label="open navigation">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" fontWeight={600}>
                Creator Workspace
              </Typography>
              <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: theme.spacing(1.5) }}>
                <ThemeToggle />
                <IconButton onClick={() => router.push(SETTINGS_LINK.href)} aria-label="Profile and settings">
                  <Avatar
                    src="/assets/avatar-default.svg"
                    alt={displayName}
                    sx={{ width: avatarSize, height: avatarSize, boxShadow: theme.shadows[3] }}
                  >
                    {initials}
                  </Avatar>
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>
        )}

        <Box
          sx={{
            px: contentPaddingX,
            py: contentPaddingY,
            maxWidth: contentMaxWidth,
            mx: 'auto',
            width: '100%',
          }}
        >
          {!isMobile && !isTablet && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                mb: theme.spacing(3),
                gap: theme.spacing(3),
              }}
            >
              <ButtonBase
                disableRipple
                onClick={() => router.push(SETTINGS_LINK.href)}
                sx={{
                  backgroundColor: 'transparent',
                  px: 0,
                  py: 0,
                  boxShadow: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing(1),
                  textAlign: 'left',
                }}
              >
                <Avatar
                  src="/assets/avatar-default.svg"
                  alt={displayName}
                  sx={{ width: avatarSize, height: avatarSize, boxShadow: theme.shadows[3] }}
                >
                  {initials}
                </Avatar>
                <Typography fontWeight={600} color="text.primary">
                  {displayName}
                </Typography>
              </ButtonBase>

              <ThemeToggle />
            </Box>
          )}
          {children}
        </Box>
      </Box>
    </Box>
  );
}
