'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { usePreloader } from '@/components/layout/PreloaderContext'

type TextTag = 'h1' | 'h2' | 'h3' | 'p'

// Module-level stable references
const motionTags = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p:  motion.p,
} as const

interface TextRevealProps {
  text: string
  as?: TextTag
  className?: string
  delay?: number
  /**
   * When true, animates on mount (for above-fold hero content).
   * When false (default), animates when the element enters the viewport.
   */
  triggerOnMount?: boolean
  /**
   * Only used when triggerOnMount=true.
   * Controls when the animation fires — set to false to hold the animation
   * until an external signal (e.g. after the preloader finishes).
   * Defaults to true.
   */
  isReady?: boolean
}

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

// Each word: clipPath reveal left→right + subtle vertical movement
const wordVariants = {
  hidden: {
    clipPath: 'inset(0 100% 0 0)',
    y: 20,
    opacity: 0,
  },
  show: {
    clipPath: 'inset(0 0% 0 0)',
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: EASE,
    },
  },
}

export function TextReveal({
  text,
  as: Tag = 'h2',
  className,
  delay = 0,
  triggerOnMount = false,
  isReady = true,
}: TextRevealProps) {
  const shouldReduce = useReducedMotion()
  const { isPreloaderDone } = usePreloader()
  const words = text.split(' ')
  const MotionTag = motionTags[Tag]

  const containerVariants = shouldReduce
    ? undefined
    : {
        hidden: { opacity: 1 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.12,
            delayChildren: delay,
          },
        },
      }

  const words_jsx = words.map((word, i) => (
    <span key={i} className={shouldReduce ? undefined : 'inline-block'}>
      {shouldReduce ? (
        <>{word}{i < words.length - 1 && '\u00A0'}</>
      ) : (
        <>
          <motion.span
            className="inline-block"
            style={{ paddingRight: '0.12em', marginRight: '-0.12em' }}
            variants={wordVariants}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && '\u00A0'}
        </>
      )}
    </span>
  ))

  if (triggerOnMount) {
    // animate="hidden" holds the animation until isReady becomes true,
    // then Framer Motion transitions to "show" with the stagger.
    const animateState = shouldReduce ? undefined : (isReady ? 'show' : 'hidden')
    return (
      <MotionTag
        className={className}
        variants={containerVariants}
        initial={shouldReduce ? undefined : 'hidden'}
        animate={animateState}
      >
        {words_jsx}
      </MotionTag>
    )
  }

  // Gate IntersectionObserver behind isPreloaderDone — same reason as ScrollReveal.
  // For section headings, isPreloaderDone is the correct gate (not isReady prop).
  const whileInViewProps = (!shouldReduce && isPreloaderDone)
    ? { whileInView: 'show' as const, viewport: { once: true, amount: 0.3 } }
    : { animate: shouldReduce ? undefined : 'hidden' as const }

  return (
    <MotionTag
      className={className}
      variants={containerVariants}
      initial={shouldReduce ? undefined : 'hidden'}
      {...whileInViewProps}
    >
      {words_jsx}
    </MotionTag>
  )
}
