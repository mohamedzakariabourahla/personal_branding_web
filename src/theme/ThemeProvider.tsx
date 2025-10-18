"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
} from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { getTheme } from "./index";

const muiCache = createCache({ key: "mui", prepend: true });

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
  mode: "light" as "light" | "dark",
});

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // ✅ Load theme before rendering
    const savedMode = localStorage.getItem("themeMode") as "light" | "dark" | null;
    if (savedMode) {
      setMode(savedMode);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setMode(prefersDark ? "dark" : "light");
    }
    setMounted(true);

    // ✅ Listen for OS theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const newMode = e.matches ? "dark" : "light";
      setMode(newMode);
      localStorage.setItem("themeMode", newMode);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleColorMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", next);
      return next;
    });
  }, []);

  const theme = useMemo(() => getTheme(mode || "light"), [mode]);

  // 🚫 Don’t render children until we know the theme (prevents FOUC)
  if (!mounted) {
    return (
      <div
        style={{
          backgroundColor: "#0d1117",
          width: "100vw",
          height: "100vh",
        }}
      />
    );
  }

  return (
    <CacheProvider value={muiCache}>
      <ColorModeContext.Provider value={{ toggleColorMode, mode: mode || "light" }}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </MuiThemeProvider>
      </ColorModeContext.Provider>
    </CacheProvider>
  );
}
