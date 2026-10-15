import type { Metadata } from 'next';
import { AuthScreen } from '@/features/auth/components/AuthScreen';

export const metadata: Metadata = {
  title: 'Criar Conta',
  description: 'Crie sua conta no BPlanner e planeje sua próxima viagem.',
};

export default async function Page({ searchParams }: { searchParams: Promise<{ convite?: string }> }) {
  const { convite } = await searchParams;
  return <AuthScreen initialTab="register" convite={convite ?? null} />;
}
