import type { Role } from './api'

declare module '@/lib/store/useAuthStore' {
  interface AuthUser {
    id: string
    name: string
    email: string
    role: Role
  }
}
