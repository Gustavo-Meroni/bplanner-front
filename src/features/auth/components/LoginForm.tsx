'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useLoginMutation } from '../api/hooks';
import { loginSchema, type LoginFormData } from '../schemas/auth-schema';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';

export function LoginForm() {
  const { mutate: login, isPending: isSubmitting } = useLoginMutation();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-foreground uppercase mb-1">Email</label>
        <div className="relative">
          <Input
            type="email"
            placeholder="seu@email.com"
            {...form.register('email')}
            className="bg-background/50"
          />
          {!form.formState.errors.email && form.watch('email') && (
            <CheckCircle2
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-success"
            />
          )}
        </div>
        {form.formState.errors.email && (
          <span className="text-xs text-destructive mt-1 flex items-center gap-1">
            <AlertCircle size={12} /> {form.formState.errors.email.message}
          </span>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-foreground uppercase mb-1">Senha</label>
        <Input
          type="password"
          placeholder="••••••••"
          {...form.register('senha')}
          className="bg-background/50"
        />
        {form.formState.errors.senha && (
          <span className="text-xs text-destructive mt-1 flex items-center gap-1">
            <AlertCircle size={12} /> {form.formState.errors.senha.message}
          </span>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        isLoading={isSubmitting}
        className="w-full mt-6"
      >
        Entrar na Conta
      </Button>
    </form>
  );
}