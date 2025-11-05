"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PageContainer from "@/shared/components/layouts/PageContainer";
import { useEmailVerification } from "@/features/auth/hooks/useEmailVerification";

export function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryToken = (searchParams.get("token") ?? "").trim();
  const { token, setToken, status, error, verify, reset } = useEmailVerification(queryToken);

  const isSuccess = status === "success";
  const isPending = status === "pending";
  const isError = status === "error";
  const showManualTokenEntry = !isSuccess && (!queryToken || isError);

  const helperMessage = useMemo(() => {
    if (isSuccess) {
      return "Your email is verified; you can sign in now.";
    }
    if (isError && error) {
      return error;
    }
    if (isPending) {
      return "Verifying your email address...";
    }
    return "Enter the verification token from your email if it was not filled in automatically.";
  }, [isSuccess, isError, isPending, error]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await verify();
    },
    [verify]
  );

  const handleLoginRedirect = useCallback(() => {
    router.replace("/login");
  }, [router]);

  const handleRetry = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <PageContainer>
      <Container maxWidth="sm" sx={{ py: { xs: 4, md: 6 } }}>
        <Card variant="outlined">
          <CardHeader title="Verify your email" subheader="Confirm your email address to finish setting up your account." />

          <CardContent>
            <Stack component="form" spacing={3} onSubmit={handleSubmit}>
              {isSuccess ? (
                <Alert severity="success" variant="filled">
                  Email verified successfully. You can now sign in.
                </Alert>
              ) : isError && error ? (
                <Alert severity="error" onClose={handleRetry}>
                  {error}
                </Alert>
              ) : (
                <Alert severity="info">{helperMessage}</Alert>
              )}

              {showManualTokenEntry && (
                <TextField
                  label="Verification token"
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  helperText={!isError ? "Paste the token from your email." : undefined}
                  disabled={isPending}
                  required
                />
              )}

              <Box>
                {isSuccess ? (
                  <Button variant="contained" color="primary" onClick={handleLoginRedirect} fullWidth>
                    Back to sign in
                  </Button>
                ) : (
                  <Stack spacing={2}>
                    <Button type="submit" variant="contained" color="primary" disabled={isPending} fullWidth>
                      {isPending ? "Verifying..." : "Verify email"}
                    </Button>

                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      Didn&apos;t receive anything? Check spam first, then use the resend option below.
                    </Typography>
                  </Stack>
                )}
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </PageContainer>
  );
}
