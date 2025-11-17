'use client';

import { Box, Container, Divider, Typography } from '@mui/material';

const sections = [
  {
    title: '1. Acceptance of terms',
    body:
      'By creating an account you agree to these terms and our privacy policy. If you register on behalf of a company you confirm you are authorized to bind that organization.',
  },
  {
    title: '2. Service description',
    body:
      'UpPersona provides AI-assisted workflows to plan ideas, generate scripts, coordinate Google Drive assets, schedule posts, and surface analytics across TikTok, Meta, and YouTube. Features may evolve over time; breaking changes or pricing updates will be announced in advance.',
  },
  {
    title: '3. Platform connectors & responsibilities',
    body:
      'You may only connect accounts you control and are responsible for complying with each platform’s policies (TikTok Business Terms, Meta Platform Policies, YouTube Terms of Service). You must have rights to any media you publish and you remain liable for the content.',
  },
  {
    title: '4. Payment',
    body:
      'The beta is free. Future paid plans will include at least 30 days notice. Subscriptions, if introduced, renew monthly and can be canceled anytime; fees are non-refundable once the billing period begins.',
  },
  {
    title: '5. Suspension & termination',
    body:
      'We may suspend or terminate access for spam, abuse, infringement, or violation of partner policies. You may delete your workspace from Settings, which revokes social tokens and removes queued posts.',
  },
  {
    title: '6. Liability',
    body:
      'The service is provided "as is" without warranties of any kind. UpPersona is not liable for indirect, incidental, or consequential damages. Our aggregate liability is limited to the fees paid in the previous 12 months.',
  },
];

export default function TermsPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight={800} gutterBottom>
        Terms of Service
      </Typography>
      <Typography color="text.secondary" paragraph>
        Last updated: {new Date().toLocaleDateString()}
      </Typography>

      <Divider sx={{ my: 4 }} />

      {sections.map((section) => (
        <Box key={section.title} mb={4}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {section.title}
          </Typography>
          <Typography color="text.secondary">{section.body}</Typography>
          <Divider sx={{ mt: 3 }} />
        </Box>
      ))}

      <Typography variant="body2" color="text.secondary">
        Questions? Email mohamedzakariabourahla@gmail.com
      </Typography>
    </Container>
  );
}
