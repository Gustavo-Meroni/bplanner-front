'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { useRegisterMutation, useValidarConviteQuery } from '../api/hooks';

const registerSchema = z
  .object({
    nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string(),
    conviteToken: z.string().optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function FormRegister() {
  const { mutate: register, isPending } = useRegisterMutation();

  const {
    register: field,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const conviteToken = watch('conviteToken') ?? '';
  const { data: conviteInfo } = useValidarConviteQuery(conviteToken);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 sm:p-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#253D2C] tracking-tight">
            Criar sua conta
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Comece a planejar seu futuro junto com seu par.
          </p>
        </div>

        <form
          onSubmit={handleSubmit((data) =>
            register({ nome: data.nome, email: data.email, password: data.password, conviteToken: data.conviteToken })
          )}
          className="space-y-4"
        >
          <Input
            label="Nome"
            placeholder="Seu nome"
            error={errors.nome?.message}
            autoComplete="name"
            {...field('nome')}
          />

          <Input
            label="E-mail"
            type="email"
            placeholder="voce@email.com"
            error={errors.email?.message}
            autoComplete="email"
            {...field('email')}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            autoComplete="new-password"
            {...field('password')}
          />

          <Input
            label="Confirmar Senha"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
            {...field('confirmPassword')}
          />

          <div className="space-y-1">
            <Input
              label="Token de Convite (opcional)"
              placeholder="Cole o token aqui"
              {...field('conviteToken')}
            />
            {conviteInfo && (
              <p className="text-xs text-[#2E6F40] font-medium pl-1">
                ✓ Convite do casal &quot;{conviteInfo.casalNome}&quot; válido!
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            size="lg"
            isLoading={isPending}
          >
            Criar Conta
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Já tem conta?{' '}
          <Link
            href="/login"
            className="font-semibold text-[#2E6F40] hover:text-[#253D2C] transition-colors"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
