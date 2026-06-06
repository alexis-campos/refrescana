'use client'

import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/lib/store/useAuthStore'

function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F2]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#1C442A]/20 border-t-[#1C442A] rounded-full animate-spin" />
        <p className="text-sm text-[#5C6B62]">Verificando sesión...</p>
      </div>
    </div>
  )
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status } = useAuthStore()
  const location = useLocation()

  if (status === 'idle' || status === 'loading') {
    return <FullPageSpinner />
  }

  if (status === 'unauthenticated') {
    return (
      <Navigate
        to={`/admin/login?from=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    )
  }

  return <>{children}</>
}
