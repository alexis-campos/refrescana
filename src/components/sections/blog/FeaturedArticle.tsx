'use client'

import Image from '@/components/ui/Img'
import Link from '@/components/ui/NavLink'
import { motion } from 'framer-motion'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { CATEGORY_LABELS } from '@/types/blog'
import type { BlogPost } from '@/types/blog'

const isotipoImg = '/logo/logo.webp'

interface FeaturedArticleProps {
  post: BlogPost
  /**
   * When true, the article fills the full viewport height and acts as the
   * page hero — full-width, no rounded corners, centered content with isotipo.
   */
  isHero?: boolean
}

export function FeaturedArticle({ post, isHero = false }: FeaturedArticleProps) {
  if (isHero) {
    return (
      <motion.article
        className="group relative w-full h-screen overflow-hidden cursor-pointer"
        whileHover="hover"
      >
        <Link
          href={`/blog/${post.slug}`}
          className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-gold focus-visible:ring-inset"
          aria-label={`Leer artículo: ${post.title}`}
        >
          {/* Background image with zoom on hover */}
          <motion.div
            className="absolute inset-0"
            variants={{
              hover: { scale: 1.03, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </motion.div>

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(51,52,29,0.5) 0%, rgba(51,52,29,0.25) 40%, rgba(51,52,29,0.65) 100%)',
            }}
          />

          {/* Centered content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[var(--container-px)]">
            {/* Isotipo */}
            <ScrollReveal variant="fade" delay={0.1} className="mb-8">
              <Image
                src={isotipoImg}
                alt="Refrescaña isotipo"
                width={80}
                height={64}
                className="object-contain opacity-85"
              />
            </ScrollReveal>

            {/* Blog label */}
            <span className="font-body text-[length:var(--text-small)] text-bg/60 uppercase tracking-wider mb-4">
              Refrescaña · Blog
            </span>

            {/* Category badge */}
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-[var(--radius-sm)] bg-accent text-text font-body text-xs uppercase tracking-wider">
                {CATEGORY_LABELS[post.category]}
              </span>
              <span className="font-body text-[length:var(--text-caption)] text-bg/70">
                {post.readingTime} de lectura
              </span>
            </div>

            {/* Title */}
            <h1
              className="font-display italic font-light text-bg tracking-tight max-w-3xl mb-4"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw + 0.5rem, 3.5rem)', lineHeight: 1.1 }}
            >
              {post.title}
            </h1>

            {/* Excerpt */}
            <p
              className="font-body text-bg/75 line-clamp-2 max-w-xl"
              style={{ fontSize: 'var(--text-body)' }}
            >
              {post.excerpt}
            </p>
          </div>
        </Link>
      </motion.article>
    )
  }

  const article = (
    <motion.article
      className="group relative w-full overflow-hidden cursor-pointer rounded-[var(--radius-2xl)] aspect-[4/3] sm:aspect-[2.5/1]"
      whileHover="hover"
    >
      <Link
        href={`/blog/${post.slug}`}
        className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-gold focus-visible:ring-inset"
        aria-label={`Leer artículo: ${post.title}`}
      >
        {/* Background image with zoom */}
        <motion.div
          className="absolute inset-0"
          variants={{
            hover: { scale: 1.03, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
          }}
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </motion.div>

        {/* Gradient overlay — green-dark from bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(51,52,29,0.85) 0%, rgba(51,52,29,0.4) 50%, transparent 100%)',
          }}
        />

        {/* Content — bottom left */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          {/* Badge + reading time */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-[var(--radius-sm)] bg-accent text-text font-body text-xs uppercase tracking-wider">
              {CATEGORY_LABELS[post.category]}
            </span>
            <span className="font-body text-[length:var(--text-caption)] text-bg/70">
              {post.readingTime} de lectura
            </span>
          </div>

          {/* Title */}
          <h2
            className="font-display italic font-light text-bg tracking-tight line-clamp-2 mb-3"
            style={{ fontSize: 'clamp(1.5rem, 3vw + 0.5rem, 3rem)', lineHeight: 1.15 }}
          >
            {post.title}
          </h2>

          {/* Excerpt */}
          <p
            className="font-body text-bg/80 line-clamp-2 max-w-2xl"
            style={{ fontSize: 'var(--text-body)' }}
          >
            {post.excerpt}
          </p>
        </div>
      </Link>
    </motion.article>
  )

  return <ScrollReveal>{article}</ScrollReveal>
}
