"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Popover,
  IconButton,
  TextField,
  InputAdornment,
  Stack,
} from "@mui/material";
import { HexColorPicker } from "react-colorful";
import { useTheme } from "@mui/material/styles";

const DEFAULT_COLOR = "#AAAAAA";

export default function BrandColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  const normalizeHex = useCallback((hex: string) => {
    const trimmed = hex?.trim() ?? "";
    if (!trimmed) return DEFAULT_COLOR;

    return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  }, []);

  const sanitizeHexInput = useCallback(
    (raw: string) => raw.replace(/[^0-9a-fA-F]/g, "").slice(0, 6),
    []
  );

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [color, setColor] = useState(() => normalizeHex(value || DEFAULT_COLOR));
  const [inputValue, setInputValue] = useState(() =>
    sanitizeHexInput(color.replace(/^#/, "")).toUpperCase()
  );
  const theme = useTheme();

  useEffect(() => {
    const nextColor = normalizeHex(value || DEFAULT_COLOR);
    setColor((current) =>
      current.toLowerCase() === nextColor.toLowerCase() ? current : nextColor
    );
    setInputValue(nextColor.replace(/^#/, "").toUpperCase());
  }, [normalizeHex, value]);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleColorChange = (newColor: string) => {
    const normalized = normalizeHex(newColor);
    setColor(normalized);
    setInputValue(normalized.replace(/^#/, "").toUpperCase());
    onChange(normalized);
  };

  const open = Boolean(anchorEl);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeHexInput(e.target.value);
    setInputValue(sanitized.toUpperCase());

    if (sanitized.length === 6) {
      handleColorChange(`#${sanitized}`);
    }
  };

  const handleInputBlur = () => {
    const sanitized = sanitizeHexInput(inputValue);

    if (sanitized.length === 3) {
      const expanded = sanitized
        .split("")
        .map((char) => char.repeat(2))
        .join("");
      handleColorChange(`#${expanded}`);
      return;
    }

    if (sanitized.length === 6) {
      handleColorChange(`#${sanitized}`);
      return;
    }

    setInputValue(color.replace(/^#/, "").toUpperCase());
  };

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} mb={1}>
        Brand Color
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Choose your main brand color. You can click the circle to open the color
        picker or enter a HEX value.
      </Typography>

      <Stack direction="row" alignItems="center" spacing={2}>
        {/* Color Circle */}
        <IconButton
          onClick={handleOpen}
          sx={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "2px solid",
            borderColor:
              theme.palette.mode === "dark"
                ? theme.palette.grey[700]
                : theme.palette.grey[300],
            bgcolor: color,
          }}
        />

        {/* Manual color input (HEX) */}
        <TextField
          label="Color"
          variant="outlined"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          sx={{ width: 160, textTransform: "uppercase", color: "text.secondary" }}
          placeholder="888888"
          slotProps={{
            input: {
              inputMode: "text",
              maxLength: 6,
              startAdornment: (
                <InputAdornment position="start" sx={{ color: "text.secondary" }}>
                  #
                </InputAdornment>
              ),
            },
          }}
        />
      </Stack>

      {/* Popover Picker */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            p: 2,
            borderRadius: 2,
            boxShadow: 3,
          },
        }}
      >
        <HexColorPicker color={color} onChange={handleColorChange} />
      </Popover>
    </Box>
  );
}
