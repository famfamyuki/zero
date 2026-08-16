import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { Analytics } from '@vercel/analytics/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'AgentGraph Studio | Visual AI Agent Workflow Builder & CrewAI Transpiler',
  description: 'Design autonomous AI agent flows visually in your browser and transpile into executable CrewAI Python code with zero running costs.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
