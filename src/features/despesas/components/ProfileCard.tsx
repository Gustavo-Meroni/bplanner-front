'use client';

import React, { useState } from 'react';
import { Plus, Trash2, CheckSquare, Square, FolderPlus } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/format-currency';
import { Profile } from '../api/types';
import {
  useCreateDespesaMutation,
  useUpdateDespesaMutation,
  useToggleDespesaMutation,
  useDeleteDespesaMutation,
  useCreateCategoriaMutation,
  useDeleteCategoriaMutation,
} from '../api/hooks';
import { InlineNumberEdit } from '@/shared/components/ui/InlineNumberEdit';
import { InlineTextEdit } from '@/shared/components/ui/InlineTextEdit';

interface ProfileCardProps {
  profile: Profile;
  activeMonth: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, activeMonth }) => {
  const [novaCategoriaNome, setNovaCategoriaNome] = useState('');
  const [novoItemNome, setNovoItemNome] = useState<{ [catId: string]: string }>({});
  const [novoItemValor, setNovoItemValor] = useState<{ [catId: string]: string }>({});

  // Mutations do TanStack Query
  const { mutate: criarDespesa } = useCreateDespesaMutation();
  const { mutate: atualizarDespesa } = useUpdateDespesaMutation();
  const { mutate: toggleDespesa } = useToggleDespesaMutation();
  const { mutate: deletarDespesa } = useDeleteDespesaMutation();
  const { mutate: criarCategoria } = useCreateCategoriaMutation();
  const { mutate: deletarCategoria } = useDeleteCategoriaMutation();

  // Cálculos do Perfil
  const totalGeral = profile.categories.reduce((acc, cat) => {
    return acc + cat.items.reduce((sum, i) => sum + i.value, 0);
  }, 0);

  const percentual = profile.limit > 0 ? Math.min(100, Math.round((totalGeral / profile.limit) * 100)) : 0;

  const handleAddCategoria = () => {
    if (!novaCategoriaNome.trim()) return;
    criarCategoria(
      { name: novaCategoriaNome.trim(), profileId: profile.id },
      { onSuccess: () => setNovaCategoriaNome('') }
    );
  };

  const handleAddItem = (categoryId: string) => {
    const nome = novoItemNome[categoryId]?.trim();
    const valorStr = novoItemValor[categoryId];
    if (!nome || !valorStr) return;

    const val = parseFloat(valorStr);
    if (isNaN(val) || val <= 0) return;

    criarDespesa(
      {
        name: nome,
        value: val,
        mes: activeMonth,
        categoryId,
        profileId: profile.id,
      },
      {
        onSuccess: () => {
          setNovoItemNome((prev) => ({ ...prev, [categoryId]: '' }));
          setNovoItemValor((prev) => ({ ...prev, [categoryId]: '' }));
        },
      }
    );
  };

  return (
    <div className="bg-card p-6 sm:p-8 rounded-[2rem] shadow-sm border border-border space-y-6">
      {/* Header do Perfil */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground">{profile.name}</h3>
          <div className="text-right">
            <span className="text-xs text-muted-foreground block font-medium">Limite do Perfil</span>
            <span className="text-sm font-bold text-foreground">{formatCurrency(profile.limit)}</span>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1 font-semibold">
            <span className="text-secondary">Total Planejado: {formatCurrency(totalGeral)}</span>
            <span className="text-muted-foreground">{percentual}% do limite</span>
          </div>
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary/70 to-primary transition-all duration-300"
              style={{ width: `${percentual}%` }}
            />
          </div>
        </div>
      </div>

      <hr className="border-border" />

      {/* Lista de Categorias */}
      <div className="space-y-6">
        {profile.categories.map((cat) => {
          const totalCategoria = cat.items.reduce((acc, i) => acc + i.value, 0);

          return (
            <div key={cat.id} className="space-y-3 p-4 bg-muted/50 rounded-2xl border border-border">
              {/* Header da Categoria */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground uppercase tracking-wider">
                  {cat.name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-secondary">
                    {formatCurrency(totalCategoria)}
                  </span>
                  <button
                    onClick={() => deletarCategoria(cat.id)}
                    className="text-muted-foreground/50 hover:text-red-500 transition-colors p-1"
                    title="Excluir Categoria"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Lista de Itens da Categoria */}
              <div className="space-y-2">
                {cat.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 bg-card rounded-xl border border-border shadow-2xs group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => toggleDespesa({ id: item.id, checked: !item.checked })}
                        className="text-muted-foreground hover:text-secondary transition-colors flex-shrink-0"
                      >
                        {item.checked ? (
                          <CheckSquare size={18} className="text-secondary" />
                        ) : (
                          <Square size={18} />
                        )}
                      </button>

                      <InlineTextEdit
                        value={item.name}
                        onSave={(novoNome) =>
                          atualizarDespesa({ id: item.id, data: { name: novoNome } })
                        }
                        className={item.checked ? 'line-through text-muted-foreground' : 'text-foreground font-medium'}
                      />
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <InlineNumberEdit
                        value={item.value}
                        onSave={(novoValor) =>
                          atualizarDespesa({ id: item.id, data: { value: novoValor } })
                        }
                      />

                      <button
                        onClick={() => deletarDespesa(item.id)}
                        className="text-muted-foreground/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        title="Excluir Item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Formulário para Adicionar Item */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Nova despesa..."
                  className="flex-1 px-3 py-1.5 bg-card border border-border rounded-lg text-xs outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                  value={novoItemNome[cat.id] || ''}
                  onChange={(e) =>
                    setNovoItemNome((prev) => ({ ...prev, [cat.id]: e.target.value }))
                  }
                />
                <div className="relative w-24">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full pl-7 pr-2 py-1.5 bg-card border border-border rounded-lg text-xs outline-none focus:border-primary font-bold text-secondary placeholder:text-muted-foreground"
                    value={novoItemValor[cat.id] || ''}
                    onChange={(e) =>
                      setNovoItemValor((prev) => ({ ...prev, [cat.id]: e.target.value }))
                    }
                  />
                </div>
                <button
                  onClick={() => handleAddItem(cat.id)}
                  className="p-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition-colors"
                  title="Adicionar Despesa"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          );
        })}

        {/* Criar Nova Categoria no Perfil */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <input
            type="text"
            placeholder="Nova categoria (ex: Viagem, Fixas)..."
            className="flex-1 px-3 py-2 bg-muted border border-border rounded-xl text-xs outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
            value={novaCategoriaNome}
            onChange={(e) => setNovaCategoriaNome(e.target.value)}
          />
          <button
            onClick={handleAddCategoria}
            className="px-3 py-2 bg-foreground text-background rounded-xl hover:bg-foreground/80 transition-colors text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
          >
            <FolderPlus size={14} /> Categoria
          </button>
        </div>
      </div>
    </div>
  );
};