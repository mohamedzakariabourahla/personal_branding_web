import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useContext } from "react";
import { ColorModeContext } from "@/theme/ThemeProvider";

export function useTheme() {
  const theme = useMuiTheme();
  const colorMode = useContext(ColorModeContext);

  return {
    theme,
    mode: theme.palette.mode,
    toggleColorMode: colorMode.toggleColorMode,
  };
}
