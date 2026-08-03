'use client';

import { useState } from 'react';
import { Check, Edit2, X, Award } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/format-currency';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { InfoTooltip } from '@/shared/components/ui/InfoTooltip';

interface SuperMetaCardProps {
  current: number;
  goal: number;
  onUpdateGoal: (v: number) => void;
  variant?: 'featured' | 'compact';
}

export function SuperMetaCard({ current, goal, onUpdateGoal, variant = 'featured' }: SuperMetaCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(goal.toString());

  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 100;
  const remaining = Math.max(goal - current, 0);
  const isGoalReached = percentage === 100 && goal > 0;
  const isCompact = variant === 'compact';

  const handleSave = () => {
    const val = Number(editValue);
    if (!isNaN(val) && val >= 0) {
      onUpdateGoal(val);
      setIsEditing(false);
    } else {
      setEditValue(goal.toString());
    }
  };

  const handleCancel = () => {
    setEditValue(goal.toString());
    setIsEditing(false);
  };

  return (
    <div className={`bg-card p-6 rounded-[2rem] shadow-sm border flex flex-col justify-between h-full transition-shadow hover:shadow-md ${isGoalReached ? 'border-primary/50 bg-primary/5' : 'border-border/50'
      } ${isCompact ? 'min-h-[140px]' : 'sm:p-8 min-h-[160px]'}`}>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Meta da Viagem (Essencial)
          </span>
          <InfoTooltip text="O valor mínimo para garantir a viagem (hospedagem, passagens e custos fixos)." />
        </div>

        <div className="mt-4 min-h-[48px] flex items-center">
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
                  className={`pl-9 font-bold bg-background border-primary focus:ring-primary/20 ${isCompact ? 'h-10 text-base' : 'h-12 text-lg'}`}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') handleCancel();
                  }}
                />
              </div>
              <Button size={isCompact ? "sm" : "lg"} variant="primary" onClick={handleSave} className={`${isCompact ? 'h-10 w-10' : 'h-12 w-12'} p-0 rounded-xl flex-shrink-0`}>
                <Check size={isCompact ? 18 : 20} />
              </Button>
              <Button size={isCompact ? "sm" : "lg"} variant="ghost" onClick={handleCancel} className={`${isCompact ? 'h-10 w-10' : 'h-12 w-12'} p-0 rounded-xl flex-shrink-0`}>
                <X size={isCompact ? 18 : 20} />
              </Button>
            </div>
          ) : (
            <div className="group flex items-center gap-2 flex-wrap">
              <span className={`${isCompact ? 'text-3xl' : 'text-4xl sm:text-5xl'} font-black tracking-tight text-primary flex items-center gap-2`}>
                {formatCurrency(goal)}
                {isGoalReached && <Award size={isCompact ? 24 : 36} className="text-primary animate-pulse flex-shrink-0" />}
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                title="Editar Meta"
              >
                <Edit2 size={isCompact ? 16 : 20} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={`space-y-3 ${isCompact ? 'mt-6' : 'mt-8'}`}>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700 ease-out relative"
            style={{ width: `${percentage}%` }}
          >
            {!isGoalReached && <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 rounded-full blur-[2px]" />}
          </div>
        </div>
        <div className="text-xs font-medium text-muted-foreground leading-tight">
          {isGoalReached ? (
            <span className="font-bold text-primary flex items-center gap-1.5">
              🎉 Meta atingida{isCompact ? '!' : ' com sucesso! Preparando as malas!'}
            </span>
          ) : (
            <>Faltam <span className="font-bold text-foreground">{formatCurrency(remaining)}</span> para atingir a meta</>
          )}
        </div>
      </div>
    </div>
  );
}