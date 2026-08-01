'use client';

import { InlineNumberEdit } from '@/shared/components/ui/InlineNumberEdit';
import { formatCurrency } from '@/shared/utils/format-currency';

interface SuperMetaCardProps {
  current: number;
  goal: number;
  onUpdateGoal: (v: number) => void;
}

export function SuperMetaCard({ current, goal, onUpdateGoal }: SuperMetaCardProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  const remaining = Math.max(goal - current, 0);

  return (
    <div className="bg-card p-6 sm:p-8 rounded-[2rem] shadow-sm border border-border flex flex-col justify-between h-full transition-shadow hover:shadow-md min-h-[160px]">
      <div>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Meta da Viagem (Essencial)
        </span>
        <div className="text-4xl font-black tracking-tight text-foreground mt-2">
          <InlineNumberEdit value={goal} onSave={onUpdateGoal} className="-ml-1.5" />
        </div>
      </div>
      <div className="mt-6 space-y-2">
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-xs font-medium text-muted-foreground">
          Faltam{' '}
          <span className="font-semibold text-foreground">{formatCurrency(remaining)}</span>{' '}
          para atingir a meta
        </div>
      </div>
    </div>
  );
}
