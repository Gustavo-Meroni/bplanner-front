'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Loader2, SearchX } from 'lucide-react';
import { useRegisterMutation, useValidarConviteQuery } from '../api/hooks';
import { registerSchema, type RegisterFormData } from '../schemas/auth-schema';
import type { CreateUsuarioDto } from '../api/types';
import { Input, PasswordInput } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { cn } from '@/lib/utils';

const MODES = [
  {
    value: false,
    title: 'Novo planejamento',
    description: 'Você cria e convida seu par depois.',
  },
  {
    value: true,
    title: 'Tenho um convite',
    description: 'Seu par já criou e te mandou o código.',
  },
];

export function RegisterForm() {
  const { mutate: registrar, isPending } = useRegisterMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { temConvite: false, codigoConvite: '', nomeCasal: '' },
  });

  const temConvite = watch('temConvite');
  const codigoDigitado = watch('codigoConvite') || '';

  const {
    data: grupoEncontrado,
    isLoading: isValidandoConvite,
    isError: isConviteInvalido,
  } = useValidarConviteQuery(temConvite ? codigoDigitado : '');

  const selectMode = (comConvite: boolean) => {
    setValue('temConvite', comConvite);
    setValue('codigoConvite', '');
    setValue('nomeCasal', '');
    clearErrors(['codigoConvite', 'nomeCasal']);
  };

  const onSubmit = (data: RegisterFormData) => {
    const payload: CreateUsuarioDto = {
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      ...(data.temConvite && data.codigoConvite
        ? { codigoConvite: data.codigoConvite.toUpperCase() }
        : { nomeCasal: data.nomeCasal }),
    };
    registrar(payload);
  };

  const codigoRegister = register('codigoConvite');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
      <Input
        label="Seu nome"
        autoComplete="given-name"
        placeholder="Como seu par te chama"
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

      {/* Como vão começar */}
      <fieldset className="pt-1">
        <legend className="mb-1.5 text-[13px] font-semibold text-foreground">Como vocês vão começar?</legend>
        <div className="grid grid-cols-2 gap-2.5">
          {MODES.map((mode) => {
            const selected = temConvite === mode.value;
            return (
              <label
                key={mode.title}
                className={cn(
                  'relative cursor-pointer rounded-xl border px-3 py-2.5 transition-colors',
                  'has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-ring/15',
                  selected
                    ? 'border-celeste bg-celeste/[0.07]'
                    : 'border-border hover:border-foreground/25'
                )}
              >
                <input
                  type="radio"
                  name="modo-cadastro"
                  className="sr-only"
                  checked={selected}
                  onChange={() => selectMode(mode.value)}
                />
                <span className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">{mode.title}</span>
                  <span
                    className={cn(
                      'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                      selected ? 'border-celeste' : 'border-muted-foreground/40'
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId="register-mode-dot"
                        className="size-1.5 rounded-full bg-celeste"
                        transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
                      />
                    )}
                  </span>
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                  {mode.description}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Campo que depende da escolha */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={temConvite ? 'convite' : 'novo'}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          {temConvite ? (
            <div className="space-y-2 pt-1">
              <Input
                label="Código do convite"
                maxLength={6}
                autoComplete="off"
                spellCheck={false}
                placeholder="ABC123"
                error={errors.codigoConvite?.message}
                className="font-semibold uppercase tracking-[0.4em] placeholder:tracking-[0.4em]"
                {...codigoRegister}
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                  codigoRegister.onChange(e);
                }}
              />

              <div aria-live="polite" className="min-h-5 text-xs font-medium">
                {isValidandoConvite && (
                  <p className="flex items-center gap-1.5 text-muted-foreground">
                    <Loader2 size={13} className="animate-spin" /> Procurando o planejamento…
                  </p>
                )}
                {grupoEncontrado && (
                  <p className="flex items-center gap-1.5 text-success animate-in fade-in zoom-in-95 duration-300">
                    <CheckCircle2 size={14} />
                    <span className="text-foreground">
                      Você vai entrar em <strong className="font-semibold">{grupoEncontrado.nome}</strong>
                    </span>
                  </p>
                )}
                {isConviteInvalido && codigoDigitado.length === 6 && (
                  <p className="flex items-center gap-1.5 text-destructive">
                    <SearchX size={13} /> Nenhum planejamento com esse código. Confira com seu par.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="pt-1">
              <Input
                label="Nome do planejamento"
                placeholder="Ex.: Gustavo e Rafa"
                error={errors.nomeCasal?.message}
                {...register('nomeCasal')}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <Button
        type="submit"
        size="lg"
        disabled={temConvite && !grupoEncontrado}
        isLoading={isPending}
        className="mt-1 w-full"
      >
        {isPending ? 'Criando conta…' : 'Criar conta'}
      </Button>
    </form>
  );
}
