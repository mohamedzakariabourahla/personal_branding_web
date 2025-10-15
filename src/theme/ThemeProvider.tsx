'use client';

import * as React from 'react';
import {
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
  createTheme,
} from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

const muiCache = createCache({ key: 'mui', prepend: true });

// ✅ Define both themes
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    background: { default: '#f5f5f5', paper: '#ffffff' },
    text: { primary: '#0f172a' },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    background: { default: '#0d1117', paper: '#161b22' },
    text: { primary: '#e6edf3' },
  },
});

// ✅ Context for toggling theme
export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
  mode: 'light' as 'light' | 'dark',
});

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');

  // ✅ Run only on client to read from localStorage & matchMedia
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedMode =
        (localStorage.getItem('themeMode') as 'light' | 'dark') ||
        (prefersDark ? 'dark' : 'light');
      setMode(savedMode);

      // Listen for OS theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        const newMode = e.matches ? 'dark' : 'light';
        setMode(newMode);
        localStorage.setItem('themeMode', newMode);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const toggleColorMode = React.useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('themeMode', next);
      }
      return next;
    });
  }, []);

  const theme = React.useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  return (
    <CacheProvider value={muiCache}>
      <ColorModeContext.Provider value={{ toggleColorMode, mode }}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </MuiThemeProvider>
      </ColorModeContext.Provider>
    </CacheProvider>
  );
}
