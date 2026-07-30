'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '@/shared/store/use-app-store';
import { useUIStore } from '@/shared/store/use-ui-store';
import { CofreViagemSection } from '@/features/aportes/components/CofreViagemSection';
import { MonthSelectorTabs } from '@/features/despesas/components/MonthSelectorTabs';
import { ProfileCard } from '@/features/despesas/components/ProfileCard';

export default function GestaoPage() {
  const {
    profiles,
    updateProfile,
    addCategory,
    deleteCategory,
    updateCategoryName,
    addItem,
    updateItem,
    deleteItem,
  } = useAppStore();

  const { activeMonth, setActiveMonth } = useUIStore();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="gestao"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[#253D2C]">Gestão de Gastos</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Organize seus gastos e planeje os próximos meses.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8 pb-20">
          {/* Cofre da Viagem */}
          <CofreViagemSection />

          {/* Month Tabs */}
          <MonthSelectorTabs activeMonth={activeMonth} onSelect={setActiveMonth} />

          {/* Profile Cards */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                activeMonth={activeMonth}
                onUpdateLimit={(val) =>
                  updateProfile(profile.id, (p) => ({ ...p, limit: val }))
                }
                onAddCategory={() => addCategory(profile.id)}
                onDeleteCategory={(categoryId) => deleteCategory(profile.id, categoryId)}
                onUpdateCategoryName={(categoryId, name) =>
                  updateCategoryName(profile.id, categoryId, name)
                }
                onAddItem={(categoryId) => addItem(profile.id, categoryId, activeMonth)}
                onToggleItem={(categoryId, itemId) =>
                  updateItem(profile.id, categoryId, itemId, (i) => ({
                    ...i,
                    checked: !i.checked,
                  }))
                }
                onUpdateItemName={(categoryId, itemId, name) =>
                  updateItem(profile.id, categoryId, itemId, (i) => ({ ...i, name }))
                }
                onUpdateItemValue={(categoryId, itemId, value) =>
                  updateItem(profile.id, categoryId, itemId, (i) => ({ ...i, value }))
                }
                onDeleteItem={(categoryId, itemId) => deleteItem(profile.id, categoryId, itemId)}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
