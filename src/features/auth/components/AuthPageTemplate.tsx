"use client";

import { Container, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";
import PageContainer from "@/shared/components/layouts/PageContainer";

interface AuthPageTemplateProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthPageTemplate({
  title,
  subtitle,
  children,
}: AuthPageTemplateProps) {
  return (
    <PageContainer>
      <Container maxWidth="sm">
        <Stack spacing={4} alignItems="center" textAlign="center">
          <Typography variant="h4" fontWeight={700}>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
          {children}
        </Stack>
      </Container>
    </PageContainer>
  );
}
