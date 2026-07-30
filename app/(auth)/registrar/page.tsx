import type { Metadata } from 'next';
import { FormRegister } from '@/features/auth/components/FormRegister';
import { Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Criar Conta',
  description: 'Crie sua conta no BPlanner e comece a planejar com seu par.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#f4fcf6] flex flex-col items-center justify-center p-4">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-gradient-to-br from-[#253D2C] to-[#2E6F40] rounded-xl shadow-md text-white">
          <Target size={24} strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold text-[#253D2C]">
          B<span className="text-[#2E6F40]">Planner</span>
        </h1>
      </div>
      <FormRegister />
    </div>
  );
}
