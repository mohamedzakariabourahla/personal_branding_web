'use client';

import Image from 'next/image';
import {
  Box,
  IconButton,
  Link as MuiLink,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import SideNavigation, { SideNavLink } from '@/shared/components/layouts/SideNavigation';

type BrandProps = {
  name: string;
  logoSrc: string;
  logoAlt?: string;
  logoSize?: number;
};

type WorkspaceDrawerProps = {
  links: SideNavLink[];
  selectedHref: string;
  onSelectSettings: () => void;
  onLogout: () => void;
  supportEmail?: string;
  brand?: BrandProps;
  settingsLabel?: string;
  logoutLabel?: string;
  surfaceColor?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

const DEFAULT_BRAND: BrandProps = {
  name: 'UpPersona',
  logoSrc: '/assets/logo.svg',
  logoAlt: 'UpPersona logo',
  logoSize: 28,
};

export default function WorkspaceDrawer({
  links,
  selectedHref,
  onSelectSettings,
  onLogout,
  supportEmail = 'support@uppersona.app',
  brand = DEFAULT_BRAND,
  settingsLabel = 'Profile & Settings',
  logoutLabel = 'Logout',
  surfaceColor,
  collapsed = false,
  onToggleCollapse,
}: WorkspaceDrawerProps) {
  const theme = useTheme();
  const surface = surfaceColor ?? theme.palette.background.paper;

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        py: theme.spacing(3),
        backgroundColor: surface,
      }}
    >
      <Box
        sx={{
          px: theme.spacing(collapsed ? 1.5 : 3),
          pb: theme.spacing(3),
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: theme.spacing(1.5),
        }}
      >
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1.5) }}>
            <Image
              src={brand.logoSrc}
              alt={brand.logoAlt ?? `${brand.name} logo`}
              width={brand.logoSize ?? DEFAULT_BRAND.logoSize!}
              height={brand.logoSize ?? DEFAULT_BRAND.logoSize!}
              priority
            />
            
              <Typography variant="h6" fontWeight={700} letterSpacing={0.4}>
                {brand.name}
              </Typography>
            
          </Box>
        )}
        {onToggleCollapse && (
          <Tooltip title={collapsed ? 'Expand menu' : 'Collapse menu'}>
            <IconButton
              size="small"
              onClick={onToggleCollapse}
              sx={{
                color: theme.palette.text.secondary,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              {collapsed ? <KeyboardDoubleArrowRightIcon /> : <KeyboardDoubleArrowLeftIcon />}
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <SideNavigation links={links} selectedHref={selectedHref} collapsed={collapsed} />

      <Box 
        sx={{
          mt: 'auto', 
          alignItems: 'center', 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
        <List
          disablePadding
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: theme.spacing(collapsed ? 0.5 : 1),
            mb: theme.spacing(1),
          }}
        >
          <ListItem disablePadding >
            <ListItemButton
              onClick={onSelectSettings}
              sx={{
                display: 'flex',       
                justifyContent: 'center',    
                gap: theme.spacing(1), 
                transition: 'box-shadow 0.2s ease, background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover
                  },
                }}
            >
              <SettingsOutlinedIcon fontSize="small" />
              <ListItemText
                primary={settingsLabel}
                primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: theme.typography.pxToRem(14),
                  }}
                sx={{ display: collapsed ? 'none' : 'block' }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={onLogout}
              sx={{
                alignItems: 'center',
                color: theme.palette.error.main,
                py: collapsed ? theme.spacing(1) : theme.spacing(1.25),
                minHeight: theme.spacing(4),
                justifyContent: 'center',
                gap: theme.spacing(1),
                transition: 'box-shadow 0.2s ease, background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover
                  },
                }}
            >
              <LogoutOutlinedIcon fontSize="small" />
              <ListItemText
                primary={logoutLabel}
                primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: theme.typography.pxToRem(14),
                  }}
                sx={{ display: collapsed ? 'none' : 'block' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
        {!collapsed && (
          <Typography variant="caption" color="text.secondary" mt={theme.spacing(2)}>
            Need help? Reach us at
            <br />
            <MuiLink href={`mailto:${supportEmail}`} color="primary.main" underline="hover">
              {supportEmail}
            </MuiLink>
          </Typography>
        )}
      </Box>
    </Box>
  );
}
