import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'sale' | 'construction' | 'delivered'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  sale:         'bg-accent text-text',
  construction: 'bg-accent text-bg',
  delivered:    'bg-secondary text-bg',
}

const variantLabels: Record<BadgeVariant, string> = {
  sale:         'En venta',
  construction: 'En obra',
  delivered:    'Entregado',
}

export function Badge({ variant = 'sale', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center',
        'font-body text-xs uppercase tracking-wider',
        'px-2.5 py-1 rounded-[var(--radius-sm)]',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children ?? variantLabels[variant]}
    </span>
  )
}
