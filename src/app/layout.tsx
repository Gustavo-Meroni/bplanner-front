import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { AppProviders } from '@/shared/components/providers/AppProviders';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'BPlanner — Planejamento Financeiro para Casais',
    template: '%s | BPlanner',
  },
  description:
    'Planeje, acompanhe e conquiste suas metas financeiras juntos. O BPlanner é o sistema de planejamento financeiro feito para casais.',
  keywords: ['planejamento financeiro', 'casal', 'metas', 'economia', 'viagem'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={plusJakartaSans.variable}>
      <body suppressHydrationWarning className="font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
