import type { Metadata } from 'next';
import ThemeProvider from '@/theme/ThemeProvider';
import NavbarVisibilityGate from '@/shared/components/NavbarVisibilityGate';
import { AuthSessionProvider } from '@/shared/providers/AuthSessionProvider';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'UpPersona Ai',
  description: 'Next.js + MUI + Spring Boot backend',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthSessionProvider>
            <NavbarVisibilityGate />
            {children}
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
