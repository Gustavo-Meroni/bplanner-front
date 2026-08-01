'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useLoginMutation } from '../api/hooks';
import { loginSchema, type LoginFormData } from '../schemas/auth-schema';

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
          <input
            type="email"
            placeholder="seu@email.com"
            {...form.register('email')}
            className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl outline-none focus:border-primary focus:bg-background text-sm text-foreground transition-all placeholder:text-muted-foreground"
          />
          {!form.formState.errors.email && form.watch('email') && (
            <CheckCircle2
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary"
            />
          )}
        </div>
        {form.formState.errors.email && (
          <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle size={12} /> {form.formState.errors.email.message}
          </span>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-foreground uppercase mb-1">Senha</label>
        <input
          type="password"
          placeholder="••••••••"
          {...form.register('senha')}
          className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl outline-none focus:border-primary focus:bg-background text-sm text-foreground transition-all placeholder:text-muted-foreground"
        />
        {form.formState.errors.senha && (
          <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle size={12} /> {form.formState.errors.senha.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-6 py-3.5 bg-primary hover:opacity-95 active:scale-[0.99] text-primary-foreground font-bold rounded-xl shadow-md transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
            className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
          />
        ) : (
          'Entrar na Conta'
        )}
      </button>
    </form>
  );
}
