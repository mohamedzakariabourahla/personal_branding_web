import type { Metadata } from 'next';
import ThemeProvider from '@/theme/ThemeProvider';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Personal Branding SaaS',
  description: 'Next.js + MUI + Spring Boot backend',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
