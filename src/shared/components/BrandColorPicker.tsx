"use client";

import { useState, useRef } from "react";
import {
  Box,
  Typography,
  Popover,
  IconButton,
  TextField,
  Stack,
} from "@mui/material";
import { HexColorPicker } from "react-colorful";
import { useTheme } from "@mui/material/styles";

export default function BrandColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [color, setColor] = useState(value || "#ffffff");
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    onChange(color);
  };

  const open = Boolean(anchorEl);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setColor(val);
    onChange(val);
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
          inputRef={inputRef}
          label="Color"
          variant="outlined"
          value={color}
          onChange={handleInputChange}
          sx={{ width: 160 }}
          placeholder="#ffffff"
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
        <HexColorPicker color={color} onChange={setColor} />
      </Popover>
    </Box>
  );
}
