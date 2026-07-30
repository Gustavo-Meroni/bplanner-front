'use client';

import { Plus } from 'lucide-react';
import { InlineNumberEdit } from '@/shared/components/ui/InlineNumberEdit';
import { CategoryGroup } from './CategoryGroup';
import { formatCurrency } from '@/shared/utils/format-currency';
import type { Profile, Item } from '@/shared/store/use-app-store';

interface ProfileCardProps {
  profile: Profile;
  activeMonth: string;
  onUpdateLimit: (val: number) => void;
  onAddCategory: () => void;
  onDeleteCategory: (categoryId: string) => void;
  onUpdateCategoryName: (categoryId: string, name: string) => void;
  onAddItem: (categoryId: string) => void;
  onToggleItem: (categoryId: string, itemId: string) => void;
  onUpdateItemName: (categoryId: string, itemId: string, name: string) => void;
  onUpdateItemValue: (categoryId: string, itemId: string, value: number) => void;
  onDeleteItem: (categoryId: string, itemId: string) => void;
}

export function ProfileCard({
  profile,
  activeMonth,
  onUpdateLimit,
  onAddCategory,
  onDeleteCategory,
  onUpdateCategoryName,
  onAddItem,
  onToggleItem,
  onUpdateItemName,
  onUpdateItemValue,
  onDeleteItem,
}: ProfileCardProps) {
  // Calculate total for this profile in the active month
  const profileTotal = profile.categories.reduce((acc, cat) => {
    return acc + cat.items.reduce((itemAcc, item: Item) => {
      const itemMes = item.mes ?? 'Ago/2026';
      return itemMes === activeMonth ? itemAcc + item.value : itemAcc;
    }, 0);
  }, 0);

  const percentage = Math.min((profileTotal / profile.limit) * 100, 100);
  const isOverLimit = profileTotal > profile.limit;

  return (
    <section className="flex flex-col bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
      {/* Profile Header */}
      <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-[#253D2C] tracking-tight">{profile.name}</h2>
          <div className="text-right flex items-center bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wider">Teto</span>
            <InlineNumberEdit
              value={profile.limit}
              onSave={onUpdateLimit}
              className="text-sm font-bold text-[#253D2C] bg-transparent -mr-1.5"
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm items-end">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-xs">Cadastrado</span>
            <span className={`text-xl font-black ${isOverLimit ? 'text-red-500' : 'text-[#253D2C]'}`}>
              {formatCurrency(profileTotal)}
            </span>
          </div>
          <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isOverLimit ? 'bg-red-500' : 'bg-[#68BA7F]'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 sm:p-6 space-y-6">
        {profile.categories.map((category) => (
          <CategoryGroup
            key={category.id}
            category={category}
            profileId={profile.id}
            activeMonth={activeMonth}
            onUpdateName={(name) => onUpdateCategoryName(category.id, name)}
            onAddItem={() => onAddItem(category.id)}
            onDeleteCategory={() => onDeleteCategory(category.id)}
            onToggleItem={(itemId) => onToggleItem(category.id, itemId)}
            onUpdateItemName={(itemId, name) => onUpdateItemName(category.id, itemId, name)}
            onUpdateItemValue={(itemId, value) => onUpdateItemValue(category.id, itemId, value)}
            onDeleteItem={(itemId) => onDeleteItem(category.id, itemId)}
          />
        ))}

        <button
          onClick={onAddCategory}
          className="w-full py-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-[#2E6F40] border border-dashed border-slate-300 hover:border-[#68BA7F] hover:bg-[#CFFFDC]/30 rounded-3xl transition-all"
          aria-label={`Adicionar subcategoria em ${profile.name}`}
        >
          <Plus size={18} strokeWidth={2.5} />
          ADICIONAR SUBCATEGORIA
        </button>
      </div>
    </section>
  );
}
