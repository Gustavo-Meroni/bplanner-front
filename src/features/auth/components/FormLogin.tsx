'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { useLoginMutation } from '../api/hooks';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function FormLogin() {
  const { mutate: login, isPending } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Card */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 sm:p-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#253D2C] tracking-tight">
            Entrar no BPlanner
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Faça login para acompanhar o planejamento do casal.
          </p>
        </div>

        <form onSubmit={handleSubmit((data) => login(data))} className="space-y-4">
          <Input
            label="E-mail"
            type="email"
            placeholder="voce@email.com"
            error={errors.email?.message}
            autoComplete="email"
            {...register('email')}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            autoComplete="current-password"
            {...register('password')}
          />

          <Button
            type="submit"
            className="w-full mt-2"
            size="lg"
            isLoading={isPending}
          >
            Entrar
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Não tem conta?{' '}
          <Link
            href="/registrar"
            className="font-semibold text-[#2E6F40] hover:text-[#253D2C] transition-colors"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
