import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
}

export interface AuthCasal {
  id: string;
  nome: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  casal: AuthCasal | null;
  /** Set full auth data after login/register */
  setAuth: (token: string, user: AuthUser, casal: AuthCasal) => void;
  /** Update only the token (e.g., after token refresh) */
  setToken: (token: string) => void;
  /** Clear all auth data (logout) */
  clearAuth: () => void;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      casal: null,

      setAuth: (token, user, casal) => set({ token, user, casal }),
      setToken: (token) => set({ token }),
      clearAuth: () => set({ token: null, user: null, casal: null }),
    }),
    {
      name: 'bplanner-auth', // localStorage key — also read by apiClient interceptor
    }
  )
);
