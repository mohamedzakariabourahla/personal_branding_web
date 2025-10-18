"use client";

import * as React from "react";
import IconButton from "@mui/material/IconButton";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useTheme } from "@/shared/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, mode, toggleColorMode } = useTheme();

  return (
    <IconButton
      onClick={toggleColorMode}
      sx={{
        color: theme.palette.text.primary,
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor:
            mode === "light"
              ? "rgba(0, 0, 0, 0.05)"
              : "rgba(255, 255, 255, 0.1)",
        },
      }}
    >
      {mode === "dark" ? (
        <LightModeIcon fontSize="small" />
      ) : (
        <DarkModeIcon fontSize="small" />
      )}
    </IconButton>
  );
}
