'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRegisterMutation, useValidarConviteQuery } from '../api/hooks';

const registerSchema = z.object({
  nome: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Informe um email válido'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  codigoConvite: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const FormRegister = () => {
  const [opcaoConvite, setOpcaoConvite] = useState<'criar' | 'entrar'>('criar');
  const { mutate: registrar, isPending } = useRegisterMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      codigoConvite: '',
    },
  });

  const codigoDigitado = watch('codigoConvite') || '';

  // Consulta automática ao backend se o usuário digitar 6 caracteres
  const {
    data: grupoEncontrado,
    isLoading: isValidandoConvite,
    isError: isConviteInvalido
  } = useValidarConviteQuery(opcaoConvite === 'entrar' ? codigoDigitado : '');

  const onSubmit = (data: RegisterFormData) => {
    const payload = {
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      ...(opcaoConvite === 'entrar' && data.codigoConvite
        ? { codigoConvite: data.codigoConvite.toUpperCase() }
        : {}),
    };
    registrar(payload);
  };

  return (
    <div className="w-full max-w-md p-8 bg-card rounded-3xl border border-border shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Criar Conta no BPlanner</h1>
        <p className="text-sm text-muted-foreground">Configure seu espaço financeiro em casal</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-foreground uppercase mb-1">Seu Nome</label>
          <input
            type="text"
            placeholder="Ex: Gustavo"
            {...register('nome')}
            className="w-full px-4 py-3 bg-muted border border-border rounded-xl outline-none focus:border-primary focus:bg-card text-sm text-foreground placeholder:text-muted-foreground"
          />
          {errors.nome && (
            <span className="text-xs text-red-500 mt-1 block">{errors.nome.message}</span>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground uppercase mb-1">Email</label>
          <input
            type="email"
            placeholder="seu@email.com"
            {...register('email')}
            className="w-full px-4 py-3 bg-muted border border-border rounded-xl outline-none focus:border-primary focus:bg-card text-sm text-foreground placeholder:text-muted-foreground"
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
            className="w-full px-4 py-3 bg-muted border border-border rounded-xl outline-none focus:border-primary focus:bg-card text-sm text-foreground placeholder:text-muted-foreground"
          />
          {errors.senha && (
            <span className="text-xs text-red-500 mt-1 block">{errors.senha.message}</span>
          )}
        </div>

        {/* Seleção entre Criar Novo ou Entrar via Código */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-foreground uppercase mb-2">Espaço Financeiro</label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
            <button
              type="button"
              onClick={() => {
                setOpcaoConvite('criar');
                setValue('codigoConvite', '');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${opcaoConvite === 'criar'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Criar Novo Grupo
            </button>
            <button
              type="button"
              onClick={() => setOpcaoConvite('entrar')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${opcaoConvite === 'entrar'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Tenho um Código
            </button>
          </div>
        </div>

        {/* Input de Código com Preview do Grupo */}
        {opcaoConvite === 'entrar' && (
          <div className="space-y-2 animate-in fade-in duration-300">
            <label className="block text-xs font-bold text-foreground uppercase mb-1">
              Código de Convite do Parceiro
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="Ex: XY7A92"
              {...register('codigoConvite')}
              className="w-full px-4 py-3 bg-muted border border-border rounded-xl outline-none focus:border-primary focus:bg-card text-sm font-mono tracking-widest text-foreground uppercase placeholder:text-muted-foreground"
            />

            {/* Status da Busca do Código */}
            {isValidandoConvite && (
              <p className="text-xs text-muted-foreground italic">Buscando grupo do parceiro...</p>
            )}

            {grupoEncontrado && (
              <div className="p-3 bg-secondary/15 border border-secondary/30 rounded-xl text-xs text-foreground font-semibold flex items-center gap-2">
                <span>🔒</span>
                <span>Entrando em: <strong>{grupoEncontrado.nome}</strong></span>
              </div>
            )}

            {isConviteInvalido && codigoDigitado.length === 6 && (
              <p className="text-xs text-red-500 font-medium">
                Código de convite não encontrado. Verifique com seu parceiro.
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || (opcaoConvite === 'entrar' && !grupoEncontrado)}
          className="w-full py-3.5 bg-primary hover:bg-primary/80 text-primary-foreground font-bold rounded-xl shadow-md transition-colors disabled:opacity-50 text-sm mt-4"
        >
          {isPending ? 'Criando conta...' : 'Concluir Cadastro'}
        </button>
      </form>

      <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
        Já possui uma conta?{' '}
        <Link href="/login" className="font-bold text-primary hover:underline">
          Faça login
        </Link>
      </div>
    </div>
  );
};