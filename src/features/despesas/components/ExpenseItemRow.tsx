'use client';

import { Check, Trash2 } from 'lucide-react';
import { InlineTextEdit } from '@/shared/components/ui/InlineTextEdit';
import { InlineNumberEdit } from '@/shared/components/ui/InlineNumberEdit';
import type { Item } from '@/shared/store/use-app-store';

interface ExpenseItemRowProps {
  item: Item;
  profileId: string;
  categoryId: string;
  onToggle: () => void;
  onUpdateName: (name: string) => void;
  onUpdateValue: (value: number) => void;
  onDelete: () => void;
}

export function ExpenseItemRow({
  item,
  onToggle,
  onUpdateName,
  onUpdateValue,
  onDelete,
}: ExpenseItemRowProps) {
  const isChecked = item.checked;

  return (
    <div className="flex items-center px-4 sm:px-5 py-3.5 gap-3 group/item transition-colors hover:bg-muted/50">
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={`w-6 h-6 rounded-md flex-shrink-0 border-2 flex items-center justify-center transition-all duration-200 ${
          isChecked
            ? 'bg-secondary border-secondary text-secondary-foreground shadow-sm'
            : 'border-border text-transparent hover:border-primary bg-card'
        }`}
        aria-label={isChecked ? 'Desmarcar como pago' : 'Marcar como pago'}
      >
        <Check size={14} strokeWidth={3} />
      </button>

      {/* Name */}
      <div className="flex-1 min-w-0 flex items-center">
        <InlineTextEdit
          value={item.name}
          onSave={onUpdateName}
          className={`flex-1 text-sm sm:text-base font-medium ${
            isChecked ? 'text-muted-foreground line-through' : 'text-foreground'
          }`}
        />
      </div>

      {/* Value & Delete */}
      <div className="flex items-center gap-2">
        <InlineNumberEdit
          value={item.value}
          onSave={onUpdateValue}
          className={`text-sm sm:text-base font-bold ${
            isChecked ? 'text-muted-foreground' : 'text-foreground'
          }`}
        />
        <button
          onClick={onDelete}
          className="p-1.5 sm:p-2 text-muted-foreground/50 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors sm:opacity-0 group-hover/item:opacity-100"
          aria-label="Excluir item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
