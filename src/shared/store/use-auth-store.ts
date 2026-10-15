import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  /** Viagem aberta no painel (o usuário pode participar de várias) */
  viagemAtivaId: string | null;
  setSessao: (token: string, user: AuthUser) => void;
  setViagemAtiva: (viagemId: string | null) => void;
  limpar: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      viagemAtivaId: null,
      setSessao: (token, user) => set({ token, user }),
      setViagemAtiva: (viagemAtivaId) => set({ viagemAtivaId }),
      limpar: () => set({ token: null, user: null, viagemAtivaId: null }),
    }),
    { name: 'bplanner-auth' }
  )
);
