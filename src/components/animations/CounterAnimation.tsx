'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, animate } from 'framer-motion'
import { usePreloader } from '@/components/layout/PreloaderContext'

interface CounterAnimationProps {
  value: number
  suffix?: string
  prefix?: string
  /** Animation duration in seconds (default 2) */
  duration?: number
  className?: string
}

/**
 * Counts from 0 to `value` when the element enters the viewport.
 * Uses expo-out easing for a satisfying deceleration at the end.
 * Formats thousands with locale separator (1500 → "1,500").
 */
export function CounterAnimation({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
  className,
}: CounterAnimationProps) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const { isPreloaderDone } = usePreloader()
  const inView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    // Gate: don't count until preloader finishes (same reason as ScrollReveal)
    if (!inView || !isPreloaderDone) return
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, isPreloaderDone, value, duration])

  const formatted =
    display >= 1000
      ? display.toLocaleString('es-PE')
      : String(display)

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  )
}
