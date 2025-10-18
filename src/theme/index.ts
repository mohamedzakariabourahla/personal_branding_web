
import { createTheme } from "@mui/material/styles";

// ✅ Light theme
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    background: { default: "#f5f5f5", paper: "#ffffff" },
    text: { primary: "#0f172a" },
  },
});

// ✅ Dark theme
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" },
    background: { default: "#0d1117", paper: "#161b22" },
    text: { primary: "#e6edf3" },
  },
});

// ✅ Helper to get theme by mode
export const getTheme = (mode: "light" | "dark") =>
  mode === "light" ? lightTheme : darkTheme;
