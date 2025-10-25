'use client';

import { Typography, Box } from '@mui/material';

export default function FooterSection() {
    return (
         <Box
        sx={{
          py: 6,
          textAlign: 'center',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? '#111827' : '#0f172a',
          color: '#fff',
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Brandify AI — Build Your Influence. All
          rights reserved.
        </Typography>
      </Box>   
    );
}