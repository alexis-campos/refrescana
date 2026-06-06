'use client'

import { forwardRef, useId, useState, useEffect, type InputHTMLAttributes } from 'react'
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, value, defaultValue, onChange, onFocus, onBlur, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const shouldReduce = useReducedMotion()

    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(
      Boolean(value ?? defaultValue ?? props['aria-label']),
    )
    const controls = useAnimationControls()

    // Shake on error
    useEffect(() => {
      if (error && !shouldReduce) {
        controls.start({
          x: [0, -8, 8, -4, 4, 0],
          transition: { duration: 0.4 },
        })
      }
    }, [error, controls, shouldReduce])

    // Sync external value changes
    useEffect(() => {
      setHasValue(Boolean(value))
    }, [value])

    const labelFloating = isFocused || hasValue

    return (
      <div className={cn('relative w-full', className)}>
        <motion.div animate={controls}>
          <div className="relative">
            {/* Label */}
            <label
              htmlFor={inputId}
              className={cn(
                'absolute left-4 pointer-events-none origin-top-left',
                'font-body text-[length:var(--text-body)] text-text/50',
                'transition-all duration-200',
                labelFloating
                  ? 'top-2 scale-[0.75] text-[color:var(--color-brown-gold)]'
                  : 'top-1/2 -translate-y-1/2 scale-100',
              )}
            >
              {label}
            </label>

            {/* Input */}
            <input
              ref={ref}
              id={inputId}
              value={value}
              defaultValue={defaultValue}
              className={cn(
                'w-full pt-6 pb-2 px-4 font-body text-[length:var(--text-body)] text-text',
                'bg-bg rounded-[var(--radius-md)] outline-none',
                'border transition-colors duration-200',
                error
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[var(--color-border)] focus:border-[var(--color-border-focus)]',
              )}
              onFocus={(e) => {
                setIsFocused(true)
                onFocus?.(e)
              }}
              onBlur={(e) => {
                setIsFocused(false)
                setHasValue(Boolean(e.target.value))
                onBlur?.(e)
              }}
              onChange={(e) => {
                setHasValue(Boolean(e.target.value))
                onChange?.(e)
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={
                error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
              }
              {...props}
            />
          </div>
        </motion.div>

        {/* Error / Hint */}
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 px-1 font-body text-xs text-red-500">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="mt-1.5 px-1 font-body text-xs text-text/50">
            {hint}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
