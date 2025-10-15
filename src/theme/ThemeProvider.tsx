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

// ✅ Define themes
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    background: { default: '#f5f5f5', paper: '#fff' },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    background: { default: '#121212', paper: '#1e1e1e' },
  },
});

// ✅ Context to toggle theme
export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
  mode: 'light' as 'light' | 'dark',
});

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const prefersDarkMode = React.useMemo(
    () => window.matchMedia?.('(prefers-color-scheme: dark)').matches,
    []
  );

  const [mode, setMode] = React.useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    return (localStorage.getItem('themeMode') as 'light' | 'dark') ||
           (prefersDarkMode ? 'dark' : 'light');
  });

  const toggleColorMode = React.useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next);
      return next;
    });
  }, []);

  const theme = React.useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  // Sync with OS theme changes
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newMode = e.matches ? 'dark' : 'light';
      setMode(newMode);
      localStorage.setItem('themeMode', newMode);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

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
