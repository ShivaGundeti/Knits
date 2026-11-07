import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Knits — Knitwear Exporter Production Tracker & Delay Warning System',
  description: 'Production tracking SaaS with predictive run-rate delay warnings, Tamil voice notes, and buyer visibility for Tiruppur knitwear exporters.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
