"use client";

import { ReactNode } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useVerifiedUserGuard } from "@/features/auth/hooks/useVerifiedUserGuard";

export function VerifiedUserGate({ children }: { children: ReactNode }) {
  const { allowed, pending } = useVerifiedUserGuard();

  if (pending) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}
