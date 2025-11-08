import { createTheme } from "@mui/material/styles";

const common = {
  typography: {
    fontFamily: [
      "Inter",
      "Roboto",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
  },
};

// ✅ Light Theme
export const lightTheme = createTheme({
  ...common,
  palette: {
    mode: "light",
    primary: { main: "#7c3aed" }, // Vibrant purple
    secondary: { main: "#9333ea" }, // Lighter purple
    success: { main: "#22c55e" },
    warning: { main: "#facc15" },
    error: { main: "#ef4444" },
    info: { main: "#3b82f6" },

    background: {
      default: "#f9fafb",
      paper: "#ffffff"
    },

    text: {
      primary: "#0f172a", // Dark blue-gray
      secondary: "#475569", // Muted
      disabled: "#94a3b8",
    },

    divider: "#e2e8f0",
  },
});

// ✅ Dark Theme
export const darkTheme = createTheme({
  ...common,
  palette: {
    mode: "dark",
    primary: { main: "#a78bfa" }, // Softer purple for dark
    secondary: { main: "#c084fc" },
    success: { main: "#4ade80" },
    warning: { main: "#facc15" },
    error: { main: "#f87171" },
    info: { main: "#60a5fa" },


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
});

// ✅ Helper
export const getTheme = (mode: "light" | "dark") =>
  mode === "light" ? lightTheme : darkTheme;
