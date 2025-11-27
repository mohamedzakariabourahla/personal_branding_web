import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const common = {
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
  spacing: 8,
  // Lean into a crisp, industrial feel.
  shape: { borderRadius: 3 },
  typography: {
    fontFamily: ["Inter", "Helvetica Neue", "Arial", "sans-serif"].join(","),
    h1: {
      fontWeight: 700,
      fontSize: "clamp(2rem, 2vw + 1rem, 3rem)",
      lineHeight: 1.15,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "clamp(1.75rem, 1.5vw + 1rem, 2.5rem)",
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontWeight: 700,
      fontSize: "clamp(1.5rem, 1.2vw + 0.9rem, 2rem)",
      lineHeight: 1.25,
    },
    h4: {
      fontWeight: 700,
      fontSize: "clamp(1.25rem, 0.8vw + 0.95rem, 1.5rem)",
      lineHeight: 1.3,
    },
    h5: {
      fontWeight: 600,
      fontSize: "clamp(1.1rem, 0.6vw + 0.9rem, 1.3rem)",
      lineHeight: 1.35,
    },
    h6: {
      fontWeight: 600,
      fontSize: "clamp(1rem, 0.4vw + 0.85rem, 1.15rem)",
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.95rem",
      lineHeight: 1.6,
    },
    button: {
      textTransform: "none" as const,
      fontWeight: 600,
    },
  },
};

export const lightTheme = responsiveFontSizes(
  createTheme({
    ...common,
    palette: {
      mode: "light",
      primary: { main: "#0ea5e9" },
      secondary: { main: "#f97316" },
      success: { main: "#22c55e" },
      warning: { main: "#facc15" },
      error: { main: "#ef4444" },
      info: { main: "#0284c7" },
      background: {
        default: "#f9fafb",
        paper: "#ffffff",
      },
      text: {
        primary: "#0f172a",
        secondary: "#475569",
        disabled: "#94a3b8",
      },
      divider: "#e2e8f0",
    },
    components: {
      MuiContainer: {
        defaultProps: { maxWidth: "lg" },
        styleOverrides: {
          root: {
            paddingLeft: "clamp(16px, 3vw, 32px)",
            paddingRight: "clamp(16px, 3vw, 32px)",
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          "*, *::before, *::after": { boxSizing: "border-box" },
          body: { minHeight: "100vh", backgroundColor: "#f9fafb" },
          img: { maxWidth: "100%", height: "auto", display: "block" },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            letterSpacing: "0.01em",
          },
        },
      },
    },
  })
);

export const darkTheme = responsiveFontSizes(
  createTheme({
    ...common,
    palette: {
      mode: "dark",
      primary: { main: "#38bdf8" },
      secondary: { main: "#fb923c" },
      success: { main: "#4ade80" },
      warning: { main: "#facc15" },
      error: { main: "#f87171" },
      info: { main: "#38bdf8" },
      background: {
        default: "#0d1117",
        paper: "#161b22",
      },
      text: {
        primary: "#e6edf3",
        secondary: "#9ca3af",
        disabled: "#6b7280",
      },
      divider: "#272b33",
    },
    components: {
      MuiContainer: {
        defaultProps: { maxWidth: "lg" },
        styleOverrides: {
          root: {
            paddingLeft: "clamp(16px, 3vw, 32px)",
            paddingRight: "clamp(16px, 3vw, 32px)",
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: { minHeight: "100vh", backgroundColor: "#0d1117" },
          img: { maxWidth: "100%", height: "auto", display: "block" },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            letterSpacing: "0.01em",
          },
        },
      },
    },
  })
);

export const getTheme = (mode: "light" | "dark") =>
  mode === "light" ? lightTheme : darkTheme;
