'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { type ReactNode } from 'react'
import { usePreloader } from '@/components/layout/PreloaderContext'

// Module-level stable references — same fix as ScrollReveal
const motionElements = {
  div:     motion.div,
  section: motion.section,
  article: motion.article,
  ul:      motion.ul,
  ol:      motion.ol,
  li:      motion.li,
  span:    motion.span,
  p:       motion.p,
} as const

type MotionElement = keyof typeof motionElements

interface StaggerContainerProps {
  children: ReactNode
  staggerDelay?: number
  delayStart?: number
  as?: MotionElement
  className?: string
}

interface StaggerItemProps {
  children: ReactNode
  as?: MotionElement
  className?: string
  /** Use clipPath reveal instead of fade+translate (good for image cards) */
  clipVariant?: boolean
}

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const fadeItemVariants = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
}

const clipItemVariants = {
  hidden: { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
  show: {
    clipPath: 'inset(0% 0 0 0)',
    opacity: 1,
    transition: { duration: 0.7, ease: EASE },
  },
}

export function StaggerContainer({
  children,
  staggerDelay = 0.15,
  delayStart = 0,
  as = 'div',
  className,
}: StaggerContainerProps) {
  const shouldReduce = useReducedMotion()
  const { isPreloaderDone } = usePreloader()
  const MotionTag = motionElements[as] as typeof motion.div

  const containerVariants = shouldReduce
    ? undefined
    : {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delayStart,
          },
        },
      }

  // Gate observer — same reason as ScrollReveal
  const motionProps = (!shouldReduce && isPreloaderDone)
    ? {
        whileInView: 'show' as const,
        viewport: { once: true, amount: 0.1 },
      }
    : {
        animate: shouldReduce ? undefined : 'hidden' as const,
      }

  return (
    <MotionTag
      className={className}
      variants={containerVariants}
      initial={shouldReduce ? undefined : 'hidden'}
      {...motionProps}
    >
      {children}
    </MotionTag>
  )
}

export function StaggerItem({
  children,
  as = 'div',
  className,
  clipVariant = false,
}: StaggerItemProps) {
  const MotionTag = motionElements[as] as typeof motion.div
  const variants = clipVariant ? clipItemVariants : fadeItemVariants

  return (
    <MotionTag className={className} variants={variants}>
      {children}
    </MotionTag>
  )
}
