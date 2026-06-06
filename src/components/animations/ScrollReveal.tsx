'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { type ReactNode } from 'react'
import { usePreloader } from '@/components/layout/PreloaderContext'

type Direction = 'up' | 'down' | 'left' | 'right'
type Variant = 'clip' | 'fade' | 'slide'

// Module-level stable references — avoids motion.create() inside render,
// which caused React to remount subtrees every render, killing animations.
const motionElements = {
  div:     motion.div,
  section: motion.section,
  article: motion.article,
  aside:   motion.aside,
  header:  motion.header,
  footer:  motion.footer,
  nav:     motion.nav,
  main:    motion.main,
  ul:      motion.ul,
  ol:      motion.ol,
  li:      motion.li,
  span:    motion.span,
  p:       motion.p,
  h1:      motion.h1,
  h2:      motion.h2,
  h3:      motion.h3,
  h4:      motion.h4,
} as const

type MotionElement = keyof typeof motionElements

interface ScrollRevealProps {
  children: ReactNode
  /**
   * clip  — clipPath reveal bottom→top (default, premium Awwwards feel)
   * fade  — opacity + translate, best for inline text / small elements
   * slide — clip + lateral movement for side entrances
   */
  variant?: Variant
  direction?: Direction
  delay?: number
  duration?: number
  once?: boolean
  amount?: number
  as?: MotionElement
  className?: string
}

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

function getOffset(direction: Direction) {
  switch (direction) {
    case 'up':    return { y: 80, x: 0 }
    case 'down':  return { y: -80, x: 0 }
    case 'left':  return { x: 80, y: 0 }
    case 'right': return { x: -80, y: 0 }
  }
}

function buildVariants(variant: Variant, direction: Direction) {
  if (variant === 'clip') {
    return {
      hidden:  { clipPath: 'inset(100% 0 0 0)' },
      visible: { clipPath: 'inset(0% 0 0 0)' },
    }
  }
  if (variant === 'slide') {
    const { x, y } = getOffset(direction)
    return {
      hidden:  { opacity: 0, clipPath: 'inset(0 100% 0 0)', x, y },
      visible: { opacity: 1, clipPath: 'inset(0 0% 0 0)', x: 0, y: 0 },
    }
  }
  // 'fade' — opacity + directional translate
  const { x, y } = getOffset(direction)
  return {
    hidden:  { opacity: 0, x, y },
    visible: { opacity: 1, x: 0, y: 0 },
  }
}

export function ScrollReveal({
  children,
  variant = 'clip',
  direction = 'up',
  delay = 0,
  duration = 0.8,
  once = true,
  amount = 0.2,
  as = 'div',
  className,
}: ScrollRevealProps) {
  const shouldReduce = useReducedMotion()
  const { isPreloaderDone } = usePreloader()
  const MotionTag = motionElements[as] as typeof motion.div
  const variants = buildVariants(variant, direction)

  // For clip variant: use threshold 0 to ensure IntersectionObserver fires correctly.
  // clipPath on the element itself can cause some browsers to report 0 intersection
  // ratio (since the "visible area" is considered 0), which would prevent whileInView
  // from ever triggering with amount > 0. Threshold 0 fires on any layout overlap.
  const viewportAmount = variant === 'clip' ? 0 : amount

  if (shouldReduce) {
    const MotionTagReduced = motionElements[as] as typeof motion.div
    return <MotionTagReduced className={className}>{children}</MotionTagReduced>
  }

  // Gate IntersectionObserver behind isPreloaderDone.
  // During the preloader, observers set up with once:true can fire early
  // (due to overflow:hidden behavior or layout at mount), consuming the "once"
  // budget invisibly. Holding in animate="hidden" prevents this.
  // When isPreloaderDone becomes true, fresh observers are created at the
  // correct scroll position.
  const motionProps = isPreloaderDone
    ? {
        whileInView: 'visible' as const,
        viewport: { once, amount: viewportAmount },
      }
    : {
        animate: 'hidden' as const,
      }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      variants={variants}
      transition={{ duration, delay, ease: EASE }}
      {...motionProps}
    >
      {children}
    </MotionTag>
  )
}
