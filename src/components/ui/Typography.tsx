import { type HTMLAttributes, type ElementType } from 'react'
import { cn } from '@/lib/utils'

// ─── Heading ─────────────────────────────────────────────────────────────────

type HeadingLevel = 1 | 2 | 3 | 4

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel
}

const headingTag = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4' } as const

const headingSize: Record<HeadingLevel, string> = {
  1: 'text-[length:var(--text-h1)]',
  2: 'text-[length:var(--text-h2)]',
  3: 'text-[length:var(--text-h3)]',
  4: 'text-[length:var(--text-h3)]',
}

export function HeroHeading({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        'font-display font-bold tracking-tight text-text',
        'text-[length:var(--text-hero)]',
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  )
}

export function Heading({ level = 2, className, children, ...props }: HeadingProps) {
  const Tag = headingTag[level] as ElementType

  return (
    <Tag
      className={cn(
        'font-display font-bold tracking-tight text-text',
        headingSize[level],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

// ─── SubHeading ───────────────────────────────────────────────────────────────

interface SubHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
}

export function SubHeading({ as: Tag = 'h3', className, children, ...props }: SubHeadingProps) {
  const Component = Tag as ElementType

  return (
    <Component
      className={cn(
        'font-serif font-medium text-text',
        'text-[length:var(--text-h3)] tracking-[-0.015em]',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

// ─── Text ─────────────────────────────────────────────────────────────────────

interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  as?: 'p' | 'span' | 'div'
  size?: 'body' | 'small' | 'caption'
}

const textSizeClasses: Record<NonNullable<TextProps['size']>, string> = {
  body:    'text-[length:var(--text-body)]',
  small:   'text-[length:var(--text-small)]',
  caption: 'text-[length:var(--text-caption)]',
}

export function Text({ as: Tag = 'p', size = 'body', className, children, ...props }: TextProps) {
  const Component = Tag as ElementType

  return (
    <Component
      className={cn(
        'font-body tracking-normal text-text',
        textSizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

// Re-export as Typography for backwards compat
export const Typography = { Heading, SubHeading, Text, HeroHeading }
