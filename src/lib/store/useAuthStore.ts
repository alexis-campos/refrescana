import { create } from 'zustand'
import { api } from '@/lib/api/endpoints'
import { ApiError } from '@/lib/api/http'
import type { AuthUser } from '@/types/api'

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

interface AuthState {
  user: AuthUser | null
  status: AuthStatus
  hydrate: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',

  hydrate: async () => {
    set({ status: 'loading' })
    try {
      const user = await api.auth.me()
      set({ user, status: 'authenticated' })
    } catch {
      set({ user: null, status: 'unauthenticated' })
    }
  },

  login: async (email: string, password: string) => {
    const user = await api.auth.login(email, password)
    set({ user, status: 'authenticated' })
  },

  logout: async () => {
    try {
      await api.auth.logout()
    } catch {
      // best-effort
    }
    set({ user: null, status: 'unauthenticated' })
  },
}))
