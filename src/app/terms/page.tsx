'use client';

import { Box, Container, Divider, Typography } from '@mui/material';

const sections = [
  {
    title: '1. Acceptance of terms',
    body:
      'By creating an account you agree to these terms and our privacy policy. If you represent a business, you confirm you have authority to bind the organization.',
  },
  {
    title: '2. Service description',
    body:
      'UpPersona provides tools to plan, generate, schedule, and analyze social content. Features may evolve over time; any breaking change will be communicated in advance.',
  },
  {
    title: '3. Permitted use',
    body:
      'You may only publish content you own or are authorized to distribute. You are responsible for complying with the terms of each platform you connect.',
  },
  {
    title: '4. Payment & trials',
    body:
      'During beta the product is free. Future paid plans will be announced with at least 30 days notice and can be canceled at any time.',
  },
  {
    title: '5. Termination',
    body:
      'We may suspend or terminate access if accounts are used for spam, abuse, or violate partner policies. You may delete your account at any time from Settings.',
  },
  {
    title: '6. Liability',
    body:
      'The service is provided “as is”. We are not liable for indirect or consequential damages. Our aggregate liability is limited to the fees you have paid in the last 12 months.',
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
        Questions? Email legal@uppersona.app
      </Typography>
    </Container>
  );
}
