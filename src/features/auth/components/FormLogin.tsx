'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useLoginMutation } from '../api/hooks';

const loginSchema = z.object({
  email: z.string().email('Informe um email válido'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const FormLogin = () => {
  const { mutate: login, isPending } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-[#253D2C]">Entrar no BPlanner</h1>
        <p className="text-sm text-slate-500">Gerencie as finanças do casal em sintonia</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#253D2C] uppercase mb-1">Email</label>
          <input
            type="email"
            placeholder="seu@email.com"
            {...register('email')}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#2E6F40] focus:bg-white text-sm text-[#253D2C] transition-colors"
          />
          {errors.email && (
            <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#253D2C] uppercase mb-1">Senha</label>
          <input
            type="password"
            placeholder="••••••••"
            {...register('senha')}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#2E6F40] focus:bg-white text-sm text-[#253D2C] transition-colors"
          />
          {errors.senha && (
            <span className="text-xs text-red-500 mt-1 block">{errors.senha.message}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 bg-[#2E6F40] hover:bg-[#253D2C] text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-50 text-sm mt-2"
        >
          {isPending ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
        Ainda não tem um espaço financeiro?{' '}
        <Link href="/registrar" className="font-bold text-[#2E6F40] hover:underline">
          Cadastre-se aqui
        </Link>
      </div>
    </div>
  );
};