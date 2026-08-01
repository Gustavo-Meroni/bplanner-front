import type { Metadata } from 'next';
import { AuthScreen } from '@/features/auth/components/AuthScreen';

export const metadata: Metadata = {
  title: 'Criar Conta',
  description: 'Crie sua conta no BPlanner e comece a planejar com seu par.',
};

export default function RegisterPage() {
  return <AuthScreen initialTab="register" />;
}
