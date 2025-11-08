'use client';

import Link from 'next/link';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export type SideNavLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

type Props = {
  links: SideNavLink[];
  selectedHref: string;
  className?: string;
  collapsed?: boolean;
};

export default function SideNavigation({ links, selectedHref, className, collapsed = false }: Props) {
  const theme = useTheme();
  const baseRadius = /*Number(theme.shape.borderRadius)*/ 0;

  return (
    <List
      className={className}
      sx={{
        mt: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(collapsed ? 0.5 : 1),
      }}
    >
      {links.map((item) => {
        const selected = selectedHref === item.href;
        return (
          <ListItem key={item.href} disablePadding>
            <Tooltip
              title={collapsed ? item.label : ''}
              placement="right"
              arrow
              disableHoverListener={!collapsed}
            >
              <ListItemButton
                component={Link}
                href={item.href}
                selected={selected}
                sx={{
                //px: collapsed ? theme.spacing(1) : theme.spacing(2.5),
                py: collapsed ? theme.spacing(1) : theme.spacing(1.25),
                //mx: collapsed ? 0 : theme.spacing(0.5),
                minHeight: theme.spacing(5.5),
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: baseRadius,
                transition: 'box-shadow 0.2s ease, background-color 0.2s ease',
                  ...(selected && {
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.primary.main,
                    boxShadow: theme.shadows[4],
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.main,
                    },
                  }),
                  '&:hover': {
                    backgroundColor: selected
                      ? theme.palette.background.paper
                      : theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? 0 : theme.spacing(3.5),
                    color: selected ? theme.palette.primary.main : theme.palette.text.secondary,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: theme.typography.pxToRem(14),
                  }}
                  sx={{ display: collapsed ? 'none' : 'block' }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        );
      })}
    </List>
  );
}
