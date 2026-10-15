import type { Metadata } from 'next';
import { AuthScreen } from '@/features/auth/components/AuthScreen';

export const metadata: Metadata = {
  title: 'Entrar',
  description: 'Entre no BPlanner para ver o plano da sua viagem.',
};

export default async function Page({ searchParams }: { searchParams: Promise<{ convite?: string }> }) {
  const { convite } = await searchParams;
  return <AuthScreen initialTab="login" convite={convite ?? null} />;
}
