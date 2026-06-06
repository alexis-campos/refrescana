'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { BlogCard } from '@/components/ui/BlogCard'
import { BLOG_FILTER_OPTIONS } from '@/types/blog'
import type { BlogPost, BlogFilterOption } from '@/types/blog'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show:  { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
}

/* ── Newsletter band ──────────────────────────────────────── */
function NewsletterBand() {
  const [email, setEmail]         = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [focused, setFocused]     = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email) setSubscribed(true)
  }

  return (
    <div className="mt-20 bg-primary rounded-[var(--radius-2xl)] px-8 md:px-16 py-14 overflow-hidden relative">
      {/* Decorative number */}
      <span className="absolute right-8 bottom-4 font-display font-bold text-[8rem] leading-none text-white/[0.04] select-none pointer-events-none">
        ✉
      </span>

      <div className="relative max-w-xl">
        <p className="font-serif font-medium text-accent text-sm uppercase tracking-[0.2em] mb-3">
          Newsletter
        </p>
        <h3 className="font-display font-bold text-bg text-[length:var(--text-h2)] leading-tight tracking-tight mb-2">
          Consejos de bienestar{' '}
          <span className="text-accent italic">en tu correo</span>
        </h3>
        <p className="font-body text-bg/55 text-[length:var(--text-body)] mb-8">
          Tips de nutrición, recetas y novedades naturales. Sin spam, solo lo que vale.
        </p>

        <AnimatePresence mode="wait">
          {subscribed ? (
            <motion.p
              key="ok"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-body text-accent font-medium text-[length:var(--text-body)]"
            >
              ¡Gracias! Pronto tendrás noticias nuestras.
            </motion.p>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-0 max-w-md"
            >
              <div className="relative flex-1 group">
                <label className={cn(
                  'block font-body text-xs uppercase tracking-[0.12em] mb-2 transition-colors',
                  focused ? 'text-accent' : 'text-bg/40',
                )}>
                  Tu correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  required
                  placeholder="correo@ejemplo.com"
                  className="w-full bg-transparent border-b border-bg/20 focus:border-accent pb-3 font-body text-[length:var(--text-body)] text-bg placeholder:text-bg/20 outline-none transition-colors duration-300"
                />
              </div>
              <button
                type="submit"
                className="sm:ml-6 sm:self-end sm:mb-[1px] mt-6 sm:mt-0 px-6 py-2.5 rounded-full font-body font-semibold text-sm bg-accent text-primary hover:bg-bg hover:text-primary transition-colors duration-200 shrink-0"
              >
                Suscribir →
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ── Main export ──────────────────────────────────────────── */
interface BlogListSectionProps {
  posts: BlogPost[]
}

export function BlogListSection({ posts }: BlogListSectionProps) {
  const [activeFilter, setActiveFilter] = useState<BlogFilterOption>('todos')
  const [visibleCount, setVisibleCount] = useState(6)

  const filtered =
    activeFilter === 'todos' ? posts : posts.filter(p => p.category === activeFilter)

  const visible   = filtered.slice(0, visibleCount)
  const hasMore   = visibleCount < filtered.length

  return (
    <section className="py-[var(--section)]">
      <div className="container">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: EASE }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
        >
          <div>
            <p className="font-serif font-medium text-accent text-sm uppercase tracking-[0.2em] mb-2">
              Artículos
            </p>
            <h2 className="font-display font-bold text-text text-[length:var(--text-h2)] leading-tight tracking-tight">
              Todos los posts
            </h2>
          </div>

          {/* Filter pills */}
          <div
            className="flex items-center gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: 'none' }}
            role="group"
            aria-label="Filtrar por categoría"
          >
            {BLOG_FILTER_OPTIONS.map(({ value, label }) => {
              const isActive = activeFilter === value
              return (
                <button
                  key={value}
                  onClick={() => {
                    setActiveFilter(value)
                    setVisibleCount(6)
                  }}
                  className={cn(
                    'flex-shrink-0 px-4 py-2 rounded-full font-body text-sm border transition-all duration-200',
                    isActive
                      ? 'bg-primary text-bg border-primary'
                      : 'bg-transparent border-[var(--color-border)] text-text/60 hover:border-primary hover:text-primary',
                  )}
                  aria-pressed={isActive}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-[var(--color-border)] mb-10" />

        {/* Article grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-body text-text/50 text-center py-20"
            >
              No hay artículos en esta categoría todavía.
            </motion.p>
          ) : (
            <motion.div
              key={activeFilter}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
            >
              {visible.map(post => (
                <motion.div key={post.id} variants={itemVariants}>
                  <BlogCard post={post} className="w-full" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load more */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex justify-center mt-12"
          >
            <button
              onClick={() => setVisibleCount(c => c + 6)}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-body font-semibold text-sm border border-[var(--color-border)] text-text/70 hover:border-primary hover:text-primary transition-all duration-200"
            >
              Cargar más artículos
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </button>
          </motion.div>
        )}

        {/* Newsletter band */}
        <NewsletterBand />

      </div>
    </section>
  )
}
