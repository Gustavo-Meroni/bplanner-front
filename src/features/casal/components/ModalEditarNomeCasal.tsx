'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { useUpdateCasalMutation } from '../api/hooks';

const schema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
});

type FormData = z.infer<typeof schema>;

interface ModalEditarNomeCasalProps {
  currentNome: string;
  onClose: () => void;
}

export function ModalEditarNomeCasal({ currentNome, onClose }: ModalEditarNomeCasalProps) {
  const { mutate: update, isPending } = useUpdateCasalMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nome: currentNome },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 w-full max-w-sm p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#253D2C]">Editar Nome do Casal</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit((data) => {
            update(data, { onSuccess: onClose });
          })}
          className="space-y-4"
        >
          <Input
            label="Nome do Casal"
            placeholder="Ex: Gu & Rafa"
            error={errors.nome?.message}
            {...register('nome')}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" isLoading={isPending}>
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
