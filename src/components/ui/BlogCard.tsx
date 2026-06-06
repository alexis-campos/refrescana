'use client'

import Image from '@/components/ui/Img'
import Link from '@/components/ui/NavLink'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CATEGORY_LABELS } from '@/types/blog'
import type { BlogPost } from '@/types/blog'

interface BlogCardProps {
  post: BlogPost
  className?: string
  /** Show a wider landscape card instead of the default portrait */
  landscape?: boolean
}

export function BlogCard({ post, className, landscape = false }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <motion.article
      className={cn(
        'group relative overflow-hidden rounded-[var(--radius-xl)] cursor-pointer',
        landscape ? 'aspect-[16/9]' : 'aspect-[3/4]',
        className,
      )}
      whileHover="hover"
    >
      <Link
        href={`/blog/${post.slug}`}
        className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
        aria-label={`Leer: ${post.title}`}
      >
        {/* Image with zoom */}
        <motion.div
          className="absolute inset-0"
          variants={{
            hover: { scale: 1.05, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
          }}
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        </motion.div>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-90"
          style={{
            background:
              'linear-gradient(to top, rgba(28,68,42,0.88) 0%, rgba(28,68,42,0.35) 55%, transparent 100%)',
          }}
        />

        {/* Accent bar — slides up on hover */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent origin-left"
          variants={{
            hover: { scaleX: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
          }}
          initial={{ scaleX: 0 }}
        />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Category + reading time */}
          <div className="flex items-center gap-2.5 mb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-accent text-primary font-body text-[10px] font-semibold uppercase tracking-[0.1em]">
              {CATEGORY_LABELS[post.category]}
            </span>
            <span className="font-body text-xs text-bg/55">
              {post.readingTime} de lectura
            </span>
          </div>

          {/* Title */}
          <h3
            className="font-display font-semibold text-bg leading-snug tracking-tight line-clamp-2 mb-2"
            style={{ fontSize: landscape ? 'var(--text-h2)' : 'var(--text-h3)' }}
          >
            {post.title}
          </h3>

          {/* Date */}
          <p className="font-body text-xs text-bg/45 mt-1">
            {formattedDate}
          </p>
        </div>
      </Link>
    </motion.article>
  )
}
