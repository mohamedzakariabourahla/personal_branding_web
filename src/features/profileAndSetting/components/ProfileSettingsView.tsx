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

const FALLBACK_VALUE = "N/A";

export function ProfileSettingsView() {
  const router = useRouter();
  const {
    user,
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
      <Stack spacing={4} sx={{ maxWidth: 960, mx: "auto", width: "100%" }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Profile & Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your personal details, security preferences, and account access.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <AccountOverviewCard
              email={user?.email ?? FALLBACK_VALUE}
              onboardingStatus={onboardingStatus}
              roles={roles}
              emailVerified={emailVerified}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <BrandProfileCard
              fullName={person?.fullName ?? FALLBACK_VALUE}
              companyName={person?.companyName ?? FALLBACK_VALUE}
              position={person?.position ?? FALLBACK_VALUE}
              phoneNumber={person?.phoneNumber ?? FALLBACK_VALUE}
            />
          </Grid>
        </Grid>

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
  onboardingStatus: string;
  roles: string[];
  emailVerified: boolean;
};

function AccountOverviewCard({ email, onboardingStatus, roles, emailVerified }: AccountOverviewProps) {
  const formattedStatus = onboardingStatus.replace(/_/g, " ").toLowerCase();
  const normalizedRoles = roles.length ? roles : ["CLIENT"];

  return (
    <Card variant="outlined">
      <CardHeader title="Account Overview" sx={{ pb: 0 }} />
      <CardContent>
        <Stack spacing={1.5}>
          <InfoRow label="Email" value={email} />
          <InfoRow label="Email verification" value={emailVerified ? "Verified" : "Pending verification"} />
          <InfoRow
            label="Status"
            value={formattedStatus.replace(/\b\w/g, (char) => char.toUpperCase())}
          />
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

type BrandProfileProps = {
  fullName: string;
  companyName: string;
  position: string;
  phoneNumber: string;
};

function BrandProfileCard({ fullName, companyName, position, phoneNumber }: BrandProfileProps) {
  return (
    <Card variant="outlined">
      <CardHeader title="Brand Profile" sx={{ pb: 0 }} />
      <CardContent>
        <Stack spacing={1.5}>
          <InfoRow label="Full name" value={fullName} />
          <InfoRow label="Company" value={companyName} />
          <InfoRow label="Position" value={position} />
          <InfoRow label="Phone" value={phoneNumber} />
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
