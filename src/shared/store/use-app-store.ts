import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Types ───────────────────────────────────────────────────────────────────
// NOTE: These are the local prototype types.
// They will eventually be replaced by the API DTOs from each feature's api/types.ts

export type Item = {
  id: string;
  name: string;
  value: number;
  checked: boolean;
  mes?: string;
};

export type Category = {
  id: string;
  name: string;
  items: Item[];
};

export type Profile = {
  id: string;
  name: string;
  limit: number;
  categories: Category[];
};

export type Aporte = {
  id: string;
  descricao: string;
  valor: number;
  data: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15);
}

// ─── Initial State ────────────────────────────────────────────────────────────

const INITIAL_PROFILES: Profile[] = [
  {
    id: 'p1',
    name: 'Planejamento Gu',
    limit: 1200,
    categories: [
      {
        id: 'c1',
        name: 'Agosto/2026',
        items: [
          { id: 'i1', name: 'Airbnb', value: 131.66, checked: false },
          { id: 'i2', name: 'Investimento', value: 200.0, checked: false },
          { id: 'i3', name: 'Reposição Reserva', value: 266.0, checked: false },
        ],
      },
    ],
  },
  {
    id: 'p2',
    name: 'Planejamento Rafa',
    limit: 500,
    categories: [
      {
        id: 'c2',
        name: 'Agosto/2026',
        items: [{ id: 'i5', name: 'Airbnb', value: 131.66, checked: false }],
      },
    ],
  },
];

// ─── Store Interface ─────────────────────────────────────────────────────────

interface AppDataState {
  tripGoal: number;
  aportes: Aporte[];
  profiles: Profile[];

  // ── Trip Goal ──
  updateTripGoal: (val: number) => void;

  // ── Aportes ──
  addAporte: (descricao: string, valor: number) => void;
  deleteAporte: (id: string) => void;

  // ── Profiles ──
  updateProfile: (profileId: string, updater: (p: Profile) => Profile) => void;

  // ── Categories ──
  addCategory: (profileId: string) => void;
  deleteCategory: (profileId: string, categoryId: string) => void;
  updateCategoryName: (profileId: string, categoryId: string, name: string) => void;

  // ── Items ──
  addItem: (profileId: string, categoryId: string, activeMonth: string) => void;
  updateItem: (
    profileId: string,
    categoryId: string,
    itemId: string,
    updater: (i: Item) => Item
  ) => void;
  deleteItem: (profileId: string, categoryId: string, itemId: string) => void;
}

// ─── Store ───────────────────────────────────────────────────────────────────

/**
 * Local app data store — persisted to localStorage.
 * ⚠️ TODO: Replace with TanStack Query hooks once NestJS API is integrated.
 */
export const useAppStore = create<AppDataState>()(
  persist(
    (set) => ({
      tripGoal: 3720.0,
      aportes: [
        {
          id: '1',
          descricao: 'Saldo Inicial (Julho)',
          valor: 900.0,
          data: new Date().toISOString(),
        },
      ],
      profiles: INITIAL_PROFILES,

      updateTripGoal: (val) => set({ tripGoal: val }),

      addAporte: (descricao, valor) =>
        set((s) => ({
          aportes: [
            ...s.aportes,
            { id: generateId(), descricao, valor, data: new Date().toISOString() },
          ],
        })),

      deleteAporte: (id) =>
        set((s) => ({ aportes: s.aportes.filter((a) => a.id !== id) })),

      updateProfile: (profileId, updater) =>
        set((s) => ({
          profiles: s.profiles.map((p) => (p.id === profileId ? updater(p) : p)),
        })),

      addCategory: (profileId) =>
        set((s) => ({
          profiles: s.profiles.map((p) =>
            p.id === profileId
              ? {
                  ...p,
                  categories: [
                    ...p.categories,
                    { id: generateId(), name: 'Nova Subcategoria', items: [] },
                  ],
                }
              : p
          ),
        })),

      deleteCategory: (profileId, categoryId) =>
        set((s) => ({
          profiles: s.profiles.map((p) =>
            p.id === profileId
              ? { ...p, categories: p.categories.filter((c) => c.id !== categoryId) }
              : p
          ),
        })),

      updateCategoryName: (profileId, categoryId, name) =>
        set((s) => ({
          profiles: s.profiles.map((p) =>
            p.id === profileId
              ? {
                  ...p,
                  categories: p.categories.map((c) =>
                    c.id === categoryId ? { ...c, name } : c
                  ),
                }
              : p
          ),
        })),

      addItem: (profileId, categoryId, activeMonth) =>
        set((s) => ({
          profiles: s.profiles.map((p) =>
            p.id === profileId
              ? {
                  ...p,
                  categories: p.categories.map((c) =>
                    c.id === categoryId
                      ? {
                          ...c,
                          items: [
                            ...c.items,
                            {
                              id: generateId(),
                              name: 'Novo Item',
                              value: 0,
                              checked: false,
                              mes: activeMonth,
                            },
                          ],
                        }
                      : c
                  ),
                }
              : p
          ),
        })),

      updateItem: (profileId, categoryId, itemId, updater) =>
        set((s) => ({
          profiles: s.profiles.map((p) =>
            p.id === profileId
              ? {
                  ...p,
                  categories: p.categories.map((c) =>
                    c.id === categoryId
                      ? {
                          ...c,
                          items: c.items.map((i) => (i.id === itemId ? updater(i) : i)),
                        }
                      : c
                  ),
                }
              : p
          ),
        })),

      deleteItem: (profileId, categoryId, itemId) =>
        set((s) => ({
          profiles: s.profiles.map((p) =>
            p.id === profileId
              ? {
                  ...p,
                  categories: p.categories.map((c) =>
                    c.id === categoryId
                      ? { ...c, items: c.items.filter((i) => i.id !== itemId) }
                      : c
                  ),
                }
              : p
          ),
        })),
    }),
    {
      name: 'bplanner-app-data',
      // Migrate from old God Component localStorage key on first load
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) return;
        try {
          const old = localStorage.getItem('ba2026_state');
          if (old) {
            const parsed = JSON.parse(old) as Partial<AppDataState>;
            if (parsed.profiles && parsed.profiles.length > 0) {
              // Force profile names to canonical values
              const migratedProfiles = parsed.profiles.map((p) => {
                if (p.id === 'p1') return { ...p, name: 'Planejamento Gu' };
                if (p.id === 'p2') return { ...p, name: 'Planejamento Rafa' };
                return p;
              });
              if (parsed.tripGoal !== undefined) state.tripGoal = parsed.tripGoal;
              if (parsed.aportes !== undefined) state.aportes = parsed.aportes;
              state.profiles = migratedProfiles;
            }
          }
        } catch {
          // Silent migration failure — keep default state
        }
      },
    }
  )
);
