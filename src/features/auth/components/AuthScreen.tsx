'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { AuthVisualSide } from './AuthVisualSide';
import { AuthSegmentedTabs, type AuthTab } from './AuthSegmentedTabs';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthScreenProps {
  initialTab?: AuthTab;
}

const COPY: Record<AuthTab, { title: string; subtitle: string; href: string; docTitle: string }> = {
  login: {
    title: 'Que bom te ver de novo',
    subtitle: 'Entre para ver quanto falta para o embarque.',
    href: '/login',
    docTitle: 'Entrar | BPlanner',
  },
  register: {
    title: 'Prepare as malas',
    subtitle: 'Crie sua conta e monte o plano da próxima viagem.',
    href: '/registrar',
    docTitle: 'Criar Conta | BPlanner',
  },
};

/** Recorte de "picote" entre o canhoto e o cartão de embarque. */
function Perforation() {
  const notch = 'absolute size-6 rounded-full border border-border bg-background';
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* horizontal (mobile) */}
      <div className="lg:hidden">
        <div className="absolute inset-x-6 top-0 border-t-2 border-dashed border-border" />
        <div className={`${notch} -left-3 -top-3`} />
        <div className={`${notch} -right-3 -top-3`} />
      </div>
      {/* vertical (desktop) */}
      <div className="hidden lg:block">
        <div className="absolute inset-y-6 left-0 border-l-2 border-dashed border-border" />
        <div className={`${notch} -left-3 -top-3`} />
        <div className={`${notch} -bottom-3 -left-3`} />
      </div>
    </div>
  );
}

export const AuthScreen = ({ initialTab = 'login' }: AuthScreenProps) => {
  const pathname = usePathname();
  const reduce = useReducedMotion() ?? false;

  // A aba vem da URL, então /login e /registrar continuam linkáveis
  const activeTab: AuthTab = pathname?.startsWith('/registrar')
    ? 'register'
    : pathname?.startsWith('/login')
      ? 'login'
      : initialTab;

  const handleTabChange = (tab: AuthTab) => {
    if (tab === activeTab) return;
    window.history.replaceState(null, '', COPY[tab].href);
    document.title = COPY[tab].docTitle;
  };

  const copy = COPY[activeTab];

  return (
    <main className="flex min-h-dvh items-center justify-center overflow-hidden p-3 sm:p-4">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex w-full max-w-[880px] flex-col overflow-hidden rounded-[24px] border border-border bg-card shadow-[0_40px_80px_-40px_hsl(var(--foreground)/0.35)] lg:min-h-[540px] lg:flex-row"
      >
        <AuthVisualSide />

        <section className="relative flex flex-1 flex-col px-6 py-8 sm:px-10 lg:py-6">
          <Perforation />

          <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
            <AuthSegmentedTabs activeTab={activeTab} onTabChange={handleTabChange} />

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <header className="mb-4">
                  <h1 className="font-display text-2xl leading-tight text-foreground sm:text-[1.75rem]">
                    {copy.title}
                  </h1>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{copy.subtitle}</p>
                </header>

                {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </motion.div>
    </main>
  );
};
