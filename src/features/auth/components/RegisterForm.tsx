'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useRegisterMutation, useValidarConviteQuery } from '../api/hooks';
import { registerSchema, type RegisterFormData } from '../schemas/auth-schema';

export function RegisterForm() {
  const { mutate: registrar, isPending: isSubmitting } = useRegisterMutation();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { temConvite: false, codigoConvite: '', nomeCasal: '' },
  });

  const temConvite = form.watch('temConvite');
  const codigoDigitado = form.watch('codigoConvite') || '';

  const {
    data: grupoEncontrado,
    isLoading: isValidandoConvite,
    isError: isConviteInvalido,
  } = useValidarConviteQuery(temConvite ? codigoDigitado : '');

  const onSubmit = (data: RegisterFormData) => {
    const payload = {
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      // Se não tem convite, envia o nome do novo casal (se API suportar, ou para futuras features)
      // Se tem convite, envia o código
      ...(data.temConvite && data.codigoConvite
        ? { codigoConvite: data.codigoConvite.toUpperCase() }
        : { nomeCasal: data.nomeCasal }),
    };
    registrar(payload as any);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-foreground uppercase mb-1">Seu Nome</label>
        <input
          type="text"
          placeholder="Ex: Gustavo"
          {...form.register('nome')}
          className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl outline-none focus:border-primary focus:bg-background text-sm text-foreground transition-all placeholder:text-muted-foreground"
        />
        {form.formState.errors.nome && (
          <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle size={12} /> {form.formState.errors.nome.message}
          </span>
        )}
      </div>

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

      {/* Convite Toggle */}
      <div className="pt-2 pb-1">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              {...form.register('temConvite')}
              onChange={(e) => {
                form.setValue('temConvite', e.target.checked);
                // Limpa os campos condicionais ao trocar o toggle
                form.setValue('codigoConvite', '');
                form.setValue('nomeCasal', '');
                form.clearErrors(['codigoConvite', 'nomeCasal']);
              }}
              className="peer sr-only"
            />
            <div className="w-5 h-5 rounded-md border-2 border-muted-foreground peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
              <CheckCircle2
                size={14}
                className="text-primary-foreground opacity-0 peer-checked:opacity-100"
                strokeWidth={3}
              />
            </div>
          </div>
          <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
            Tenho o código de convite do meu parceiro(a)
          </span>
        </label>
      </div>

      {/* Campo Dinâmico Convite vs Novo Casal */}
      <AnimatePresence mode="wait">
        {temConvite ? (
          <motion.div
            key="convite"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <label className="block text-xs font-bold text-foreground uppercase mb-1">
              Código do Convite (ex: LOVE-89)
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="XXXXXX"
              {...form.register('codigoConvite')}
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl outline-none focus:border-primary focus:bg-background text-sm font-mono tracking-widest text-foreground uppercase transition-all placeholder:text-muted-foreground"
            />
            {form.formState.errors.codigoConvite && (
              <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {form.formState.errors.codigoConvite.message}
              </span>
            )}

            {/* Feedback do Convite */}
            {isValidandoConvite && (
              <p className="text-xs text-muted-foreground italic mt-2">Buscando grupo...</p>
            )}
            {grupoEncontrado && (
              <div className="mt-2 p-3 bg-secondary/10 border border-secondary/20 rounded-xl text-xs text-foreground font-semibold flex items-center gap-2">
                <span>🔒</span>
                <span>
                  Entrando em: <strong className="text-secondary">{grupoEncontrado.nome}</strong>
                </span>
              </div>
            )}
            {isConviteInvalido && codigoDigitado.length === 6 && (
              <p className="text-xs text-red-500 font-medium mt-2 flex items-center gap-1">
                <AlertCircle size={12} /> Convite não encontrado.
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="novo-casal"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <label className="block text-xs font-bold text-foreground uppercase mb-1">
              Nome do Novo Casal
            </label>
            <input
              type="text"
              placeholder="Ex: Casal Silva"
              {...form.register('nomeCasal')}
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl outline-none focus:border-primary focus:bg-background text-sm text-foreground transition-all placeholder:text-muted-foreground"
            />
            {form.formState.errors.nomeCasal && (
              <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {form.formState.errors.nomeCasal.message}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={isSubmitting || (temConvite && !grupoEncontrado)}
        className="w-full mt-6 py-3.5 bg-primary hover:opacity-95 active:scale-[0.99] text-primary-foreground font-bold rounded-xl shadow-md transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
            className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
          />
        ) : (
          'Começar Agora'
        )}
      </button>
    </form>
  );
}
