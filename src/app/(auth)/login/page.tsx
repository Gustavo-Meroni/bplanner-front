import type { Metadata } from 'next';
import { AuthScreen } from '@/features/auth/components/AuthScreen';

export const metadata: Metadata = {
  title: 'Entrar',
  description: 'Faça login no BPlanner para acessar seu planejamento financeiro.',
};

export default function LoginPage() {
  return <AuthScreen initialTab="login" />;
}
