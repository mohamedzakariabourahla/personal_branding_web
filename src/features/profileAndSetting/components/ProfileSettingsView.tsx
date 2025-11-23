"use client";

import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Divider,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import PageContainer from "@/shared/components/layouts/PageContainer";
import { useProfileSettings } from "../hooks/useProfileSettings";
import { AuthTokens, PersonProfile } from "@/features/auth/models/AuthModel";

const FALLBACK_VALUE = "N/A";

const formatStatus = (value: string) =>
  value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

export function ProfileSettingsView() {
  const router = useRouter();
  const {
    user,
    tokens,
    onboardingStatus,
    roles,
    person,
    emailVerified,
    submittingReset,
    resendingVerification,
    verificationCooldown,
    feedback,
    requestPasswordReset,
    resendEmailVerification,
    clearFeedback,
    logout,
  } = useProfileSettings();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <PageContainer>
      <Stack spacing={4} sx={{ maxWidth: 1100, mx: "auto", width: "100%" }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Profile & Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account, brand details, and security so scheduling stays reliable across devices.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <AccountOverviewCard
              email={user?.email ?? FALLBACK_VALUE}
              userId={user?.id ?? null}
              onboardingStatus={onboardingStatus}
              roles={roles}
              emailVerified={emailVerified}
              active={user?.active ?? false}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <BrandProfileCard person={person} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <ContentPreferencesCard person={person} />
          </Grid>
        </Grid>

        <SessionDetailsCard tokens={tokens} />

        <SecurityCard
          emailVerified={emailVerified}
          resendingVerification={resendingVerification}
          verificationCooldown={verificationCooldown}
          submittingReset={submittingReset}
          onResendVerification={resendEmailVerification}
          onRequestReset={requestPasswordReset}
          onLogout={handleLogout}
        />
      </Stack>

      <Snackbar
        open={Boolean(feedback)}
        autoHideDuration={6000}
        onClose={clearFeedback}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={feedback?.severity ?? "info"}
          variant="filled"
          onClose={clearFeedback}
          sx={{ width: "100%" }}
        >
          {feedback?.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
}

type AccountOverviewProps = {
  email: string;
  userId: number | null;
  onboardingStatus: string;
  roles: string[];
  emailVerified: boolean;
  active: boolean;
};

function AccountOverviewCard({ email, userId, onboardingStatus, roles, emailVerified, active }: AccountOverviewProps) {
  const normalizedRoles = roles.length ? roles : ["CLIENT"];

  return (
    <Card variant="outlined">
      <CardHeader title="Account Overview" sx={{ pb: 0 }} />
      <CardContent>
        <Stack spacing={1.25}>
          <InfoRow label="Email" value={email} />
          <InfoRow label="Account ID" value={userId ? String(userId) : FALLBACK_VALUE} />
          <InfoRow label="Status" value={formatStatus(onboardingStatus)} />
          <InfoRow label="Email verification" value={emailVerified ? "Verified" : "Pending verification"} />
          <InfoRow label="Account activity" value={active ? "Active" : "Disabled"} />
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Roles
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {normalizedRoles.map((role) => (
                <Chip key={role} label={role} size="small" color="primary" variant="outlined" />
              ))}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function BrandProfileCard({ person }: { person: PersonProfile | null }) {
  return (
    <Card variant="outlined">
      <CardHeader title="Brand Profile" sx={{ pb: 0 }} />
      <CardContent>
        <Stack spacing={1.25}>
          <InfoRow label="Full name" value={person?.fullName ?? FALLBACK_VALUE} />
          <InfoRow label="Company" value={person?.companyName ?? FALLBACK_VALUE} />
          <InfoRow label="Position" value={person?.position ?? FALLBACK_VALUE} />
          <InfoRow label="Phone" value={person?.phoneNumber ?? FALLBACK_VALUE} />
          <InfoRow label="Primary color" value={person?.brandColor ?? FALLBACK_VALUE} />
          <InfoRow label="Font style" value={person?.fontStyle ?? FALLBACK_VALUE} />
        </Stack>
      </CardContent>
    </Card>
  );
}

function ContentPreferencesCard({ person }: { person: PersonProfile | null }) {
  const sections: { label: string; values: string[] }[] = [
    { label: "Niches", values: person?.niches?.map((item) => item.name) ?? [] },
    { label: "Audiences", values: person?.audiences?.map((item) => item.name) ?? [] },
    { label: "Tones", values: person?.tones?.map((item) => item.name) ?? [] },
    { label: "Platforms", values: person?.platforms?.map((item) => item.name) ?? [] },
    { label: "Countries", values: person?.countries?.map((item) => item.name) ?? [] },
    { label: "Posting frequency", values: person?.postingFrequencies?.map((item) => item.name) ?? [] },
  ];

  return (
    <Card variant="outlined">
      <CardHeader title="Content Preferences" sx={{ pb: 0 }} />
      <CardContent>
        <Stack spacing={1.5}>
          {sections.map((section) => (
            <Box key={section.label}>
              <Typography variant="body2" color="text.secondary">
                {section.label}
              </Typography>
              {section.values.length ? (
                <Stack direction="row" spacing={1} flexWrap="wrap" mt={0.5}>
                  {section.values.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Stack>
              ) : (
                <Typography variant="subtitle2">{FALLBACK_VALUE}</Typography>
              )}
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

function SessionDetailsCard({ tokens }: { tokens: AuthTokens | null }) {
  const rows = [
    { label: "Device ID", value: tokens?.deviceId ?? FALLBACK_VALUE },
    { label: "Device name", value: tokens?.deviceName ?? FALLBACK_VALUE },
    { label: "Token type", value: tokens?.tokenType ?? FALLBACK_VALUE },
  ];

  return (
    <Card variant="outlined">
      <CardHeader title="Session & Device" sx={{ pb: 0 }} />
      <CardContent>
        <Stack spacing={1.25}>
          {rows.map((row) => (
            <InfoRow key={row.label} label={row.label} value={row.value} />
          ))}
          <Typography variant="body2" color="text.secondary">
            Keep this device trusted and sign out remotely if you suspect unauthorized access.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

type SecurityCardProps = {
  emailVerified: boolean;
  resendingVerification: boolean;
  verificationCooldown: number;
  submittingReset: boolean;
  onResendVerification: () => void | Promise<void>;
  onRequestReset: () => void | Promise<void>;
  onLogout: () => void | Promise<void>;
};

function SecurityCard({
  emailVerified,
  resendingVerification,
  verificationCooldown,
  submittingReset,
  onResendVerification,
  onRequestReset,
  onLogout,
}: SecurityCardProps) {
  const remaining = Math.max(verificationCooldown, 0);
  let cooldownLabel = `${remaining} second${remaining === 1 ? "" : "s"}`;
  if (remaining >= 60) {
    const minutes = Math.max(Math.ceil(remaining / 60), 1);
    cooldownLabel = `${minutes} minute${minutes === 1 ? "" : "s"}`;
  }

  return (
    <Card variant="outlined">
      <CardHeader title="Security" sx={{ pb: 0 }} />
      <CardContent>
        {!emailVerified && (
          <Alert
            severity="warning"
            sx={{ mb: 3 }}
            action={
              <Button
                color="warning"
                size="small"
                onClick={onResendVerification}
                disabled={resendingVerification || verificationCooldown > 0}
              >
                {resendingVerification
                  ? "Sending..."
                  : verificationCooldown > 0
                  ? `Resend (${remaining}s)`
                  : "Resend email"}
              </Button>
            }
          >
            Your email address is not verified. Please confirm it to avoid losing access to your account.
            {verificationCooldown > 0 && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                You can request another verification email in {cooldownLabel}.
              </Typography>
            )}
          </Alert>
        )}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Password Reset
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Send yourself a password reset email to securely update your credentials.
            </Typography>
          </Box>
          <Button variant="contained" color="primary" disabled={submittingReset} onClick={onRequestReset}>
            {submittingReset ? "Sending..." : "Send reset email"}
          </Button>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Logout
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign out of this device to keep your account secure.
            </Typography>
          </Box>
          <Button variant="outlined" color="inherit" onClick={onLogout}>
            Logout
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle2">{value || FALLBACK_VALUE}</Typography>
    </Box>
  );
}
