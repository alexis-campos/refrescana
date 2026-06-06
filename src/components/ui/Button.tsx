'use client'

import { forwardRef, cloneElement, isValidElement, type ButtonHTMLAttributes, type ReactElement } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-[length:var(--text-body)] gap-2',
  lg: 'px-8 py-4 text-[length:var(--text-body)] gap-2.5',
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:   'bg-accent text-surface border border-accent',
  secondary: 'border border-secondary text-secondary bg-transparent',
  ghost:     'text-text bg-transparent',
}

const overlayClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:   'bg-primary',
  secondary: 'bg-secondary',
  ghost:     'bg-secondary/10',
}

const textHoverClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:   'group-hover:text-bg',
  secondary: 'group-hover:text-bg',
  ghost:     'group-hover:text-secondary',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', asChild = false, className, children, ...props }, ref) => {
    const shouldReduce = useReducedMotion()

    const baseClasses = cn(
      'group relative overflow-hidden inline-flex items-center justify-center',
      'font-body tracking-normal cursor-pointer select-none',
      'rounded-[var(--radius-lg)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:pointer-events-none',
      sizeClasses[size],
      variantClasses[variant],
      className,
    )

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{ className?: string; children?: React.ReactNode }>
      return cloneElement(child, {
        ...props,
        className: cn(baseClasses, child.props.className, 'group'),
        children: (
          <>
            <span aria-hidden className={cn('absolute inset-0 pointer-events-none', shouldReduce ? 'opacity-0 group-hover:opacity-100' : '[clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0%_0_0)] transition-[clip-path] duration-300', overlayClasses[variant])} />
            <span className={cn('relative z-10 transition-colors duration-[var(--duration-fast)]', textHoverClasses[variant])}>{child.props.children}</span>
          </>
        ),
      } as Record<string, unknown>)
    }

    return (
      <motion.button
        ref={ref}
        className={baseClasses}
        whileHover="hover"
        whileTap={{ scale: shouldReduce ? 1 : 0.97 }}
        transition={{ duration: 0.1 }}
        {...(props as Record<string, unknown>)}
      >
        <motion.span aria-hidden className={cn('absolute inset-0 pointer-events-none', overlayClasses[variant])} variants={{ hover: { clipPath: 'inset(0 0% 0 0)', transition: { duration: shouldReduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] } } }} initial={{ clipPath: 'inset(0 100% 0 0)' }} />
        <span className={cn('relative z-10 transition-colors duration-[var(--duration-fast)]', textHoverClasses[variant])}>{children}</span>
      </motion.button>
    )
  },
)

Button.displayName = 'Button'
