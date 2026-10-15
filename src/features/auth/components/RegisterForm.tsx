'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegisterMutation } from '../api/hooks';
import { registerSchema, type RegisterFormData } from '../schemas/auth-schema';
import { Input, PasswordInput } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';

export function RegisterForm({ convite }: { convite?: string | null }) {
  const { mutate: registrar, isPending, isSuccess } = useRegisterMutation(convite);
  const ocupado = isPending || isSuccess;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  return (
    <form onSubmit={handleSubmit((data) => registrar(data))} className="space-y-3.5" noValidate>
      <Input
        label="Seu nome"
        autoComplete="given-name"
        placeholder="Como você quer ser chamado"
        error={errors.nome?.message}
        {...register('nome')}
      />

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
        autoComplete="new-password"
        placeholder="Mínimo de 6 caracteres"
        error={errors.senha?.message}
        {...register('senha')}
      />

      <Button type="submit" size="lg" isLoading={ocupado} className="mt-2 w-full">
        {ocupado ? 'Criando conta…' : 'Criar conta'}
      </Button>

      {!convite && (
        <p className="pt-1 text-center text-xs leading-relaxed text-muted-foreground">
          Vai viajar com alguém? Depois de criar a viagem você gera um link de convite.
        </p>
      )}
    </form>
  );
}
