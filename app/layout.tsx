import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { Analytics } from '@vercel/analytics/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  metadataBase: new URL('https://zero-six-khaki.vercel.app'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'AgentGraph Studio',
    title: 'AgentGraph Studio | Workflow Architecture Preflight & Portable Export',
    description: 'Understand, evaluate, and manually improve AI workflow architecture with deterministic Preflight, then export portable JSON or deterministic CrewAI Python.',
    images: [{ url: '/launch-preview.png', width: 1200, height: 630, alt: 'AgentGraph Studio: Understand → Evaluate → Improve → Verify → Own. Deterministic Preflight · Portable Export.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgentGraph Studio | Workflow Architecture Preflight & Portable Export',
    description: 'Understand, evaluate, and manually improve AI workflow architecture with deterministic Preflight, then export portable JSON or deterministic CrewAI Python.',
    images: [{ url: '/launch-preview.png', alt: 'AgentGraph Studio: Understand → Evaluate → Improve → Verify → Own. Deterministic Preflight · Portable Export.' }],
  },
  title: 'AgentGraph Studio | Workflow Architecture Preflight & Portable Export',
  description: 'Understand, evaluate, and manually improve AI workflow architecture with deterministic Preflight. Import supported CrewAI Python or AgentGraph JSON, review static evidence, then export portable JSON or deterministic CrewAI Python.',
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
