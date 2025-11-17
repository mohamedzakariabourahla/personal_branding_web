'use client';

import { Box, Container, Divider, Typography } from '@mui/material';

const sections = [
  {
    title: '1. Information we collect',
    body: `When you create an account we store your name, email, workspace preferences, onboarding answers (industry, tone,
    target audience), and any media you upload for content creation. When you connect TikTok, Meta, or YouTube we also
    store provider IDs, display names, and the encrypted OAuth tokens required to publish or sync analytics.`,
  },
  {
    title: '2. How information is used',
    body: `Profile data powers the AI templates that suggest scripts, captions, and carousel layouts tailored to your niche.
    Connected-account data is only used to schedule posts, check publishing status, and pull engagement metrics. We do
    not sell data or repurpose it to train third-party foundation models.`,
  },
  {
    title: '3. Platform connections and sharing',
    body: `We only act on accounts you explicitly authorize. Tokens never leave our infrastructure and can be revoked at any
    time from the Publishing screen or directly within each social platform. Aside from those integrations, no data is
    shared with external partners.`,
  },
  {
    title: '4. Retention & security',
    body: `Access tokens are rotated automatically and deleted within 30 days of disconnection. Customer-generated content
    is kept for 12 months to drive analytics unless you request earlier deletion. Credentials are encrypted with
    AES-GCM, production access is limited to vetted staff, and all admin actions are logged.`,
  },
  {
    title: '5. Your rights & contact',
    body: `You may request a copy of your data, revoke consent, or delete your account by emailing mohamedzakariabourahla@gmail.com.
    We respond within 7 business days and complete verified deletion requests within 30 days.`,
  },
];

export default function PrivacyPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight={800} gutterBottom>
        Privacy Policy
      </Typography>
      <Typography color="text.secondary" paragraph>
        Last updated: {new Date().toLocaleDateString()}
      </Typography>

      <Typography paragraph>
        UpPersona helps creators and operators plan, publish, and analyze personal-brand content from one
        dashboard. This policy explains the information we collect, how it powers the experience, and the controls you
        have over that information.
      </Typography>

      <Divider sx={{ my: 4 }} />

      {sections.map((section, index) => (
        <Box key={section.title} mb={4}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {section.title}
          </Typography>
          <Typography color="text.secondary">{section.body}</Typography>
          {index !== sections.length - 1 && <Divider sx={{ mt: 3 }} />}
        </Box>
      ))}
    </Container>
  );
}
