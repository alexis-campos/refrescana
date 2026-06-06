'use client'

import { type HTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const MotionDiv = motion.div
const MotionArticle = motion.article
const MotionSection = motion.section
const MotionLi = motion.li

const motionTagMap = {
  div: MotionDiv,
  article: MotionArticle,
  section: MotionSection,
  li: MotionLi,
} as const

interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'pastel'
  hoverable?: boolean
  as?: 'div' | 'article' | 'section' | 'li'
}

export function Card({
  variant = 'default',
  hoverable = false,
  as: Tag = 'div',
  className,
  children,
  ...props
}: CardProps) {
  const baseClasses = cn(
    'rounded-[var(--radius-xl)] overflow-hidden',
    variant === 'default' ? 'bg-bg' : 'bg-surface',
    'shadow-[var(--shadow-sm)]',
    hoverable && 'cursor-pointer',
    className,
  )

  if (!hoverable) {
    return (
      <Tag className={baseClasses} {...props}>
        {children}
      </Tag>
    )
  }

  const MotionTag = motionTagMap[Tag]

  return (
    <MotionTag
      className={baseClasses}
      whileHover={{
        y: -8,
        boxShadow: 'var(--shadow-hover)',
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
      }}
      whileTap={{ scale: 0.99 }}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </MotionTag>
  )
}
