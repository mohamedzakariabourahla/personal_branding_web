'use client';

import { Box, Container, Divider, Typography } from '@mui/material';

const sections = [
  {
    title: '1. Data we collect',
    body: `Account information (name, email, onboarding details), content preferences, and platform tokens required to
    publish on your behalf. OAuth tokens are encrypted at rest and can be revoked at any time from the Publishing
    screen.`,
  },
  {
    title: '2. How we use data',
    body: `To authenticate you, generate content suggestions, schedule posts, and surface analytics. We never sell your data
    or use it to train third-party models.`,
  },
  {
    title: '3. Sharing & retention',
    body: `We only share data with social platforms you explicitly connect (TikTok, Meta, YouTube). Tokens are rotated
    automatically and removed within 30 days of disconnection.`,
  },
  {
    title: '4. Security',
    body: `Credentials are encrypted using AES-GCM. Access to infrastructure is logged and restricted via least
    privilege.`,
  },
  {
    title: '5. Contact',
    body: `For any privacy request email privacy@uppersona.app. We respond within 7 business days and honor all deletion
    requests.`,
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
        UpPersona (“we”, “our”) provides automation tools to help creators build their personal brand. This policy
        explains how we collect, use, and protect your information.
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
