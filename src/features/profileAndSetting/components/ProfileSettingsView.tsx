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
  Divider,
  Grid,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import PageContainer from "@/shared/components/layouts/PageContainer";
import { useProfileSettings } from "../hooks/useProfileSettings";

export function ProfileSettingsView() {
  const router = useRouter();
  const {
    user,
    onboardingStatus,
    roles,
    person,
    submittingReset,
    feedback,
    requestPasswordReset,
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
              email={user?.email ?? "—"}
              onboardingStatus={onboardingStatus}
              roles={roles}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <BrandProfileCard
              fullName={person?.fullName ?? "—"}
              companyName={person?.companyName ?? "—"}
              position={person?.position ?? "—"}
              phoneNumber={person?.phoneNumber ?? "—"}
            />
          </Grid>
        </Grid>

        <SecurityCard
          submittingReset={submittingReset}
          onRequestReset={() => void requestPasswordReset()}
          onLogout={() => void handleLogout()}
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
};

function AccountOverviewCard({ email, onboardingStatus, roles }: AccountOverviewProps) {
  return (
    <Card variant="outlined">
      <CardHeader title="Account Overview" sx={{ pb: 0 }} />
      <CardContent>
        <Stack spacing={1.5}>
          <InfoRow label="Email" value={email} />
          <InfoRow label="Status" value={onboardingStatus.replace("_", " ")} />
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Roles
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {roles.length ? (
                roles.map((role) => (
                  <Chip key={role} label={role} size="small" color="primary" variant="outlined" />
                ))
              ) : (
                <Chip label="CLIENT" size="small" variant="outlined" />
              )}
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

function SecurityCard({
  submittingReset,
  onRequestReset,
  onLogout,
}: {
  submittingReset: boolean;
  onRequestReset: () => void;
  onLogout: () => void;
}) {
  return (
    <Card variant="outlined">
      <CardHeader title="Security" sx={{ pb: 0 }} />
      <CardContent>
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
          <Button
            variant="contained"
            color="primary"
            disabled={submittingReset}
            onClick={onRequestReset}
          >
            {submittingReset ? "Sending…" : "Send Reset Email"}
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
      <Typography variant="subtitle2">{value}</Typography>
    </Box>
  );
}
