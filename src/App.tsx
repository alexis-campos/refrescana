import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { router } from '@/routes/AppRouter'

export default function App() {
  useEffect(() => {
    useAuthStore.getState().hydrate()
  }, [])

  return <RouterProvider router={router} />
}
