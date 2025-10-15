'use client';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Personal Branding SaaS</Typography>
        <ThemeToggle />
      </Toolbar>
    </AppBar>
  );
}
