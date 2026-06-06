'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'

interface PreloaderContextValue {
  isPreloaderDone: boolean
  onPreloaderDone: () => void
}

const PreloaderContext = createContext<PreloaderContextValue>({
  isPreloaderDone: true,
  onPreloaderDone: () => {},
})

export function PreloaderProvider({ children }: { children: ReactNode }) {
  // Always start false on both server and client so the initial SSR HTML matches
  // the client's first render — avoiding hydration mismatches.
  // useEffect (post-hydration) immediately sets true on return visits.
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    // Check synchronously after hydration: if the inline script already hid the
    // curtain (return visit / reduced motion), activate animations immediately.
    const curtain = document.getElementById('preloader-curtain')
    if (!curtain || curtain.style.display === 'none') {
      setIsDone(true)
    }
  }, [])

  const onPreloaderDone = useCallback(() => {
    const curtain = document.getElementById('preloader-curtain')
    if (curtain) curtain.style.display = 'none'
    setIsDone(true)
  }, [])

  return (
    <PreloaderContext.Provider value={{ isPreloaderDone: isDone, onPreloaderDone }}>
      {children}
    </PreloaderContext.Provider>
  )
}

export function usePreloader() {
  return useContext(PreloaderContext)
}
