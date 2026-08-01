import type { Metadata } from 'next';
import { FormRegister } from '@/features/auth/components/FormRegister';
import { Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Criar Conta',
  description: 'Crie sua conta no BPlanner e comece a planejar com seu par.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-gradient-to-br from-primary to-primary/70 rounded-xl shadow-md text-primary-foreground">
          <Target size={24} strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          B<span className="text-primary">Planner</span>
        </h1>
      </div>
      <FormRegister />
    </div>
  );
}
