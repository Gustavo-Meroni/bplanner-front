'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutation } from '../api/hooks';
import { loginSchema, type LoginFormData } from '../schemas/auth-schema';
import { Input, PasswordInput } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';

export function LoginForm() {
  const { mutate: login, isPending } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit((data) => login(data))} className="space-y-3.5" noValidate>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="voce@email.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <PasswordInput
        label="Senha"
        autoComplete="current-password"
        placeholder="Sua senha"
        error={errors.senha?.message}
        {...register('senha')}
      />

      <Button type="submit" size="lg" isLoading={isPending} className="mt-2 w-full">
        {isPending ? 'Entrando…' : 'Entrar'}
      </Button>
    </form>
  );
}
