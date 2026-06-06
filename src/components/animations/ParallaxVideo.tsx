'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, useInView } from 'framer-motion'
import { usePreloader } from '@/components/layout/PreloaderContext'

interface ParallaxVideoProps {
  src: string
  /** 0–1 strength. Default 0.5 = very noticeable parallax (±100px range) */
  speed?: number
  className?: string
  /**
   * Reveal the video with a clipPath wipe when it enters the viewport.
   * Default false — enable explicitly only when NOT inside a ScrollReveal wrapper.
   */
  reveal?: boolean
  poster?: string
}

export function ParallaxVideo({
  src,
  speed = 0.5,
  className,
  reveal = false,
  poster,
}: ParallaxVideoProps) {
  const shouldReduce = useReducedMotion()
  const { isPreloaderDone } = usePreloader()
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const yRange = shouldReduce ? 0 : speed * 200  // speed=0.5 → ±100px
  const y = useTransform(scrollYProgress, [0, 1], [`${yRange}px`, `-${yRange}px`])

  // Subtle zoom-out as video scrolls into view (scale 1.15 → 1.0)
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.15, 1.0])

  const isInView = useInView(ref, { once: true, amount: 0.15 })

  // Gate reveal animation behind isPreloaderDone (same reason as ScrollReveal)
  const shouldReveal = reveal && !shouldReduce && isInView && isPreloaderDone

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ''}`}>
      {/* clipPath reveal — wipes from bottom to top as element enters viewport */}
      <motion.div
        className="h-full w-full"
        initial={reveal && !shouldReduce ? { clipPath: 'inset(100% 0 0 0)' } : undefined}
        animate={
          shouldReveal
            ? { clipPath: 'inset(0% 0 0 0)' }
            : undefined
        }
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Parallax movement layer */}
        <motion.div
          style={{ y: shouldReduce ? '0px' : y }}
          className="h-full w-full"
        >
          {/* Zoom-out scale layer */}
          <motion.div
            style={{ scale: shouldReduce ? 1 : scale }}
            className="h-full w-full"
          >
            <video
              src={src}
              poster={poster}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
              style={{ filter: 'saturate(0.95) brightness(1.02) contrast(1.01)' }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
