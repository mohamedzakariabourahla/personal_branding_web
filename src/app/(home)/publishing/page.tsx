"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";

export default function PublishingRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/publishing/accounts");
  }, [router]);

  return (
    <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Stack spacing={2} alignItems="center">
        <CircularProgress />
        <Typography color="text.secondary">Redirecting to publishing...</Typography>
      </Stack>
    </Box>
  );
}
