import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { Analytics } from '@vercel/analytics/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'AgentGraph Studio | Preflight Engineering for CrewAI Workflows',
  description: 'Design or import CrewAI workflows, review readiness, execution structure, and resource implications before you run them, then export deterministic Python.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className="h-full bg-slate-950 text-slate-100 antialiased font-sans">
        <ErrorBoundary>
          <LanguageProvider>{children}</LanguageProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
