'use client';

import { useState } from 'react';
import { Check, Edit2, X } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/format-currency';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';

interface SuperMetaCardProps {
  current: number;
  goal: number;
  onUpdateGoal: (v: number) => void;
}

export function SuperMetaCard({ current, goal, onUpdateGoal }: SuperMetaCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(goal.toString());

  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 100;
  const remaining = Math.max(goal - current, 0);

  const handleSave = () => {
    const val = Number(editValue);
    // Garante que é um número válido e não é negativo!
    if (!isNaN(val) && val >= 0) {
      onUpdateGoal(val);
      setIsEditing(false);
    } else {
      // Se tentar salvar um valor negativo, reseta para o valor original
      setEditValue(goal.toString());
    }
  };

  const handleCancel = () => {
    setEditValue(goal.toString());
    setIsEditing(false);
  };

  return (
    <div className="bg-card p-6 sm:p-8 rounded-[2rem] shadow-sm border border-border/50 flex flex-col justify-between h-full transition-shadow hover:shadow-md min-h-[160px]">
      <div>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Meta da Viagem (Essencial)
        </span>

        {/* Container da Meta (Modo Leitura vs Edição) */}
        <div className="mt-2 min-h-[48px] flex items-center">
          {isEditing ? (
            <div className="flex items-center gap-2 w-full animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="relative max-w-[200px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">R$</span>
                <Input
                  type="number"
                  min="0"
                  step="100"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="pl-9 h-10 font-bold bg-background border-primary focus:ring-primary/20"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') handleCancel();
                  }}
                />
              </div>
              <Button size="sm" variant="primary" onClick={handleSave} className="h-10 w-10 p-0 rounded-xl flex-shrink-0">
                <Check size={18} />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancel} className="h-10 w-10 p-0 rounded-xl flex-shrink-0">
                <X size={18} />
              </Button>
            </div>
          ) : (
            <div className="group flex items-center gap-3">
              <span className="text-4xl font-black tracking-tight text-primary">
                {formatCurrency(goal)}
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                title="Editar Meta"
              >
                <Edit2 size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700 ease-out relative"
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 rounded-full blur-[2px]" />
          </div>
        </div>
        <div className="text-xs font-medium text-muted-foreground">
          Faltam <span className="font-semibold text-foreground">{formatCurrency(remaining)}</span> para atingir a meta
        </div>
      </div>
    </div>
  );
}