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
    <div className="w-full max-w-md p-8 bg-card rounded-3xl border border-border shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Entrar no BPlanner</h1>
        <p className="text-sm text-muted-foreground">Gerencie as finanças do casal em sintonia</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-foreground uppercase mb-1">Email</label>
          <input
            type="email"
            placeholder="seu@email.com"
            {...register('email')}
            className="w-full px-4 py-3 bg-muted border border-border rounded-xl outline-none focus:border-primary focus:bg-card text-sm text-foreground transition-colors placeholder:text-muted-foreground"
          />
          {errors.email && (
            <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground uppercase mb-1">Senha</label>
          <input
            type="password"
            placeholder="••••••••"
            {...register('senha')}
            className="w-full px-4 py-3 bg-muted border border-border rounded-xl outline-none focus:border-primary focus:bg-card text-sm text-foreground transition-colors placeholder:text-muted-foreground"
          />
          {errors.senha && (
            <span className="text-xs text-red-500 mt-1 block">{errors.senha.message}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 bg-primary hover:bg-primary/80 text-primary-foreground font-bold rounded-xl shadow-md transition-colors disabled:opacity-50 text-sm mt-2"
        >
          {isPending ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
        Ainda não tem um espaço financeiro?{' '}
        <Link href="/registrar" className="font-bold text-primary hover:underline">
          Cadastre-se aqui
        </Link>
      </div>
    </div>
  );
};