'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket } from 'lucide-react';
import { BoardingPassCard } from '@/shared/components/brand/BoardingPass';
import { useConvitePreviaQuery } from '@/features/convites/api/hooks';
import { AuthVisualSide } from './AuthVisualSide';
import { AuthSegmentedTabs, type AuthTab } from './AuthSegmentedTabs';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthScreenProps {
  initialTab?: AuthTab;
  /** Código de convite vindo de /convite/[codigo] */
  convite?: string | null;
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

export const AuthScreen = ({ initialTab = 'login', convite }: AuthScreenProps) => {
  const pathname = usePathname();

  // A aba vem da URL, então /login e /registrar continuam linkáveis
  const activeTab: AuthTab = pathname?.startsWith('/registrar')
    ? 'register'
    : pathname?.startsWith('/login')
      ? 'login'
      : initialTab;

  const handleTabChange = (tab: AuthTab) => {
    if (tab === activeTab) return;
    const query = convite ? `?convite=${encodeURIComponent(convite)}` : '';
    window.history.replaceState(null, '', COPY[tab].href + query);
    document.title = COPY[tab].docTitle;
  };

  const copy = COPY[activeTab];

  return (
    <BoardingPassCard stub={<AuthVisualSide />}>
      {convite && <AvisoConvite codigo={convite} />}

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
            <h1 className="font-display text-2xl leading-tight text-foreground sm:text-[1.75rem]">{copy.title}</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{copy.subtitle}</p>
          </header>

          {activeTab === 'login' ? <LoginForm convite={convite} /> : <RegisterForm convite={convite} />}
        </motion.div>
      </AnimatePresence>
    </BoardingPassCard>
  );
};

/** Lembrete de que, ao entrar, a pessoa já cai na viagem do convite */
function AvisoConvite({ codigo }: { codigo: string }) {
  const { data } = useConvitePreviaQuery(codigo);
  if (!data) return null;

  const destino = data.viagem.destinoNome ?? data.viagem.nome;
  return (
    <div className="mb-5 flex items-center gap-3 rounded-xl border border-primary/25 bg-primary/[0.07] px-3.5 py-2.5 animate-in fade-in slide-in-from-top-1 duration-300">
      <Ticket size={18} className="shrink-0 text-primary" />
      <p className="text-[13px] leading-snug text-foreground">
        {data.convidadoPor ? `${data.convidadoPor} te convidou para` : 'Convite para'}{' '}
        <strong className="font-semibold">{destino}</strong>. Entre ou crie sua conta para participar.
      </p>
    </div>
  );
}
