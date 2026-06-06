'use client'

import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext<React.MutableRefObject<Lenis | null>>({ current: null })

export function useLenis() {
  return useContext(LenisContext)
}

interface SmoothScrollProps {
  children: ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) return

    const isMobile = window.innerWidth < 768

    const lenisInstance = new Lenis({
      lerp: 0.08,
      wheelMultiplier: isMobile ? 1 : 1.2,
      touchMultiplier: isMobile ? 1.5 : 2,
    })

    lenisRef.current = lenisInstance

    lenisInstance.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => {
      lenisInstance.raf(time)
      rafIdRef.current = requestAnimationFrame(raf)
    }

    rafIdRef.current = requestAnimationFrame(raf)

    return () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current)
      lenisInstance.destroy()
      lenisRef.current = null
    }
  }, [])

  return (
    <LenisContext.Provider value={lenisRef}>
      {children}
    </LenisContext.Provider>
  )
}
