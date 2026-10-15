import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Young_Serif } from 'next/font/google';
import { AppProviders } from '@/shared/components/providers/AppProviders';
import { ThemeProvider } from '@/shared/components/theme-provider';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

// Serifada de display: lembra os letreiros dos cafés antigos de Buenos Aires
const youngSerif = Young_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: {
    default: 'BPlanner — Planejamento de viagem',
    template: '%s | BPlanner',
  },
  description:
    'Planeje sua viagem, sozinho ou com quem vai junto: destino, meta, aportes e parcelas até o embarque.',
  keywords: ['planejamento de viagem', 'metas', 'parcelas', 'viagem em grupo'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${plusJakartaSans.variable} ${youngSerif.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AppProviders>{children}</AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
