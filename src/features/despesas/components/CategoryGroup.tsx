'use client';

import { Plus, Trash2 } from 'lucide-react';
import { InlineTextEdit } from '@/shared/components/ui/InlineTextEdit';
import { ExpenseItemRow } from './ExpenseItemRow';
import type { Category, Item } from '@/shared/store/use-app-store';

interface CategoryGroupProps {
  category: Category;
  profileId: string;
  activeMonth: string;
  onUpdateName: (name: string) => void;
  onAddItem: () => void;
  onDeleteCategory: () => void;
  onToggleItem: (itemId: string) => void;
  onUpdateItemName: (itemId: string, name: string) => void;
  onUpdateItemValue: (itemId: string, value: number) => void;
  onDeleteItem: (itemId: string) => void;
}

export function CategoryGroup({
  category,
  profileId,
  activeMonth,
  onUpdateName,
  onAddItem,
  onDeleteCategory,
  onToggleItem,
  onUpdateItemName,
  onUpdateItemValue,
  onDeleteItem,
}: CategoryGroupProps) {
  const filteredItems = category.items.filter(
    (i: Item) => (i.mes ?? 'Ago/2026') === activeMonth
  );

  return (
    <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden group/cat">
      {/* Category Header */}
      <div className="bg-muted/40 px-5 py-4 flex items-center justify-between border-b border-border">
        <InlineTextEdit
          value={category.name}
          onSave={onUpdateName}
          className="font-bold text-foreground text-sm sm:text-base -ml-1.5"
        />
        <div className="flex items-center gap-1 sm:opacity-0 group-hover/cat:opacity-100 transition-opacity">
          <button
            onClick={onAddItem}
            className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-colors"
            title="Adicionar Item"
            aria-label="Adicionar item à subcategoria"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
          <button
            onClick={onDeleteCategory}
            className="p-2 text-muted-foreground hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors"
            title="Excluir Subcategoria"
            aria-label="Excluir subcategoria"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Items */}
      <div className="divide-y divide-border/50">
        {filteredItems.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground italic">
            Nenhum item adicionado nesta subcategoria para {activeMonth}.
          </div>
        ) : (
          filteredItems.map((item) => (
            <ExpenseItemRow
              key={item.id}
              item={item}
              profileId={profileId}
              categoryId={category.id}
              onToggle={() => onToggleItem(item.id)}
              onUpdateName={(name) => onUpdateItemName(item.id, name)}
              onUpdateValue={(value) => onUpdateItemValue(item.id, value)}
              onDelete={() => onDeleteItem(item.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
