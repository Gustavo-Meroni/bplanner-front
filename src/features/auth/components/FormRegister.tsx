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
    <div className="w-full max-w-md p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-[#253D2C]">Criar Conta no BPlanner</h1>
        <p className="text-sm text-slate-500">Configure seu espaço financeiro em casal</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#253D2C] uppercase mb-1">Seu Nome</label>
          <input
            type="text"
            placeholder="Ex: Gustavo"
            {...register('nome')}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#2E6F40] focus:bg-white text-sm text-[#253D2C]"
          />
          {errors.nome && (
            <span className="text-xs text-red-500 mt-1 block">{errors.nome.message}</span>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#253D2C] uppercase mb-1">Email</label>
          <input
            type="email"
            placeholder="seu@email.com"
            {...register('email')}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#2E6F40] focus:bg-white text-sm text-[#253D2C]"
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
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#2E6F40] focus:bg-white text-sm text-[#253D2C]"
          />
          {errors.senha && (
            <span className="text-xs text-red-500 mt-1 block">{errors.senha.message}</span>
          )}
        </div>

        {/* Seleção entre Criar Novo ou Entrar via Código */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-[#253D2C] uppercase mb-2">Espaço Financeiro</label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setOpcaoConvite('criar');
                setValue('codigoConvite', '');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${opcaoConvite === 'criar'
                  ? 'bg-white text-[#253D2C] shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              Criar Novo Grupo
            </button>
            <button
              type="button"
              onClick={() => setOpcaoConvite('entrar')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${opcaoConvite === 'entrar'
                  ? 'bg-white text-[#2E6F40] shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              Tenho um Código
            </button>
          </div>
        </div>

        {/* Input de Código com Preview do Grupo */}
        {opcaoConvite === 'entrar' && (
          <div className="space-y-2 animate-in fade-in duration-300">
            <label className="block text-xs font-bold text-[#253D2C] uppercase mb-1">
              Código de Convite do Parceiro
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="Ex: XY7A92"
              {...register('codigoConvite')}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#2E6F40] focus:bg-white text-sm font-mono tracking-widest text-[#253D2C] uppercase"
            />

            {/* Status da Busca do Código */}
            {isValidandoConvite && (
              <p className="text-xs text-slate-400 italic">Buscando grupo do parceiro...</p>
            )}

            {grupoEncontrado && (
              <div className="p-3 bg-[#CFFFDC]/40 border border-[#68BA7F]/40 rounded-xl text-xs text-[#253D2C] font-semibold flex items-center gap-2">
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
          className="w-full py-3.5 bg-[#2E6F40] hover:bg-[#253D2C] text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-50 text-sm mt-4"
        >
          {isPending ? 'Criando conta...' : 'Concluir Cadastro'}
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
        Já possui uma conta?{' '}
        <Link href="/login" className="font-bold text-[#2E6F40] hover:underline">
          Faça login
        </Link>
      </div>
    </div>
  );
};