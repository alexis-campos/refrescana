'use client'

import { useRef, useState } from 'react'
import Image from '@/components/ui/Img'
import Link from '@/components/ui/NavLink'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { BlogCard } from '@/components/ui/BlogCard'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer'
import { CATEGORY_LABELS } from '@/types/blog'
import type { BlogPost } from '@/types/blog'

// ── READING PROGRESS BAR ──────────────────────────────────────────────────────
function ReadingProgressBar({ articleRef }: { articleRef: React.RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ['start start', 'end end'],
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-accent z-50 origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  )
}

// ── ARTICLE HERO ──────────────────────────────────────────────────────────────
function ArticleHero({ post }: { post: BlogPost }) {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, -80])

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div
      ref={heroRef}
      className="relative w-full overflow-hidden aspect-[16/9] md:aspect-[21/9]"
    >
      {/* Parallax image */}
      <motion.div className="absolute inset-0 scale-110" style={{ y }}>
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
            'linear-gradient(to top, rgba(51,52,29,0.75) 0%, rgba(51,52,29,0.3) 60%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 px-[var(--container-px)] pb-12 md:pb-16">
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex px-3 py-1 rounded-[var(--radius-sm)] bg-accent text-text font-body text-xs uppercase tracking-wider mb-4">
              {CATEGORY_LABELS[post.category]}
            </span>

            <h1
              className="font-display italic font-light text-bg tracking-tight mb-4 max-w-3xl"
              style={{ fontSize: 'var(--text-h1)', lineHeight: 1.15 }}
            >
              {post.title}
            </h1>

            <p className="font-body text-bg/75 text-[length:var(--text-small)]">
              Por {post.author} · {formattedDate} · {post.readingTime} de lectura
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ── ARTICLE CONTENT ───────────────────────────────────────────────────────────
function ArticleContent({ content }: { content: string }) {
  return (
    <div
      className="article-content font-body text-text leading-[1.8] max-w-[720px] mx-auto py-[var(--section)] px-[var(--container-px)]"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

// ── SHARE BUTTONS ─────────────────────────────────────────────────────────────
function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false)
  const url =
    typeof window !== 'undefined'
      ? `${window.location.origin}/blog/${slug}`
      : `https://refrescana.pe/blog/${slug}`

  const shares = [
    {
      label: 'WhatsApp',
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>,
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
    {
      label: 'Facebook',
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M14.5 10h-2v-1.5c0-.8.4-1.5 1.5-1.5h1V4.5c-.3 0-1.2-.1-2.5-.1-2.5 0-4.5 1.6-4.5 4.6V10h-2v3h2v8h3v-8h2.5L14.5 10z"/></svg>,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      label: 'LinkedIn',
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.5 8h3v11h-3V8zM6 6.5C5 6.5 4 5.7 4 4.8s1-1.8 2-1.8c1.1 0 2 .8 2 1.8S7.1 6.5 6 6.5zM11.5 8h3v1.6h.1c.4-.8 1.4-1.6 2.9-1.6 3.1 0 3.7 2 3.7 4.7v6.3h-3v-5.6c0-1.3 0-3-1.8-3-1.8 0-2.1 1.4-2.1 2.9v5.7h-3V8z"/></svg>,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ]

  async function handleCopy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-[720px] mx-auto px-[var(--container-px)] pb-16">
      <div className="border-t border-[var(--color-border)] pt-10">
        <p className="font-body text-[length:var(--text-small)] text-text/60 text-center mb-5">
          Compartir este artículo
        </p>
        <div className="flex items-center justify-center gap-3">
          {shares.map(({ label, icon, href }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Compartir en ${label}`}
              className="w-12 h-12 rounded-[var(--radius-full)] bg-surface flex items-center justify-center text-xl transition-colors duration-[var(--duration-fast)] hover:bg-accent"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {icon}
            </motion.a>
          ))}

          {/* Copy link */}
          <div className="relative">
            <motion.button
              onClick={handleCopy}
              aria-label="Copiar enlace"
              className="w-12 h-12 rounded-[var(--radius-full)] bg-surface flex items-center justify-center text-xl transition-colors duration-[var(--duration-fast)] hover:bg-accent"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            </motion.button>

            <AnimatePresence>
              {copied && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-[var(--radius-sm)] bg-primary text-bg font-body text-xs pointer-events-none"
                >
                  ¡Copiado!
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── RELATED ARTICLES ──────────────────────────────────────────────────────────
function RelatedArticles({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null

  return (
    <section className="bg-surface py-[var(--section)]">
      <div className="max-w-[1280px] mx-auto px-[var(--container-px)]">
        <ScrollReveal>
          <h2
            className="font-display italic font-light text-text tracking-tight mb-10"
            style={{ fontSize: 'var(--text-h2)' }}
          >
            Sigue leyendo
          </h2>
        </ScrollReveal>

        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          staggerDelay={0.08}
        >
          {posts.map(post => (
            <StaggerItem key={post.id}>
              <BlogCard post={post} className="h-full" />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

// ── NEWSLETTER BAND ───────────────────────────────────────────────────────────
function NewsletterBand() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email) setSubscribed(true)
  }

  return (
    <section className="bg-bg py-[var(--section)]">
      <div className="max-w-[480px] mx-auto px-[var(--container-px)] text-center">
        <ScrollReveal>
          <h2
            className="font-display italic font-light text-text tracking-tight mb-3"
            style={{ fontSize: 'var(--text-h2)' }}
          >
            Recibe consejos de bienestar
          </h2>
          <p className="font-body text-text/60 text-[length:var(--text-body)] mb-8">
            Tips de nutrición, cuidado personal y novedades Refrescaña cada semana. Sin spam.
          </p>

          <AnimatePresence mode="wait">
            {subscribed ? (
              <motion.p
                key="thanks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-body text-accent font-medium text-[length:var(--text-body)]"
              >
                ¡Gracias por suscribirte! Pronto tendrás noticias nuestras.
              </motion.p>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Input
                  label="Tu correo electrónico"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" variant="primary" className="sm:self-start sm:mt-3">
                  Suscribir →
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </ScrollReveal>
      </div>
    </section>
  )
}

// ── MAIN EXPORT ────────────────────────────────────────────────────────────────
interface ArticlePageLayoutProps {
  post: BlogPost
  related: BlogPost[]
}

export function ArticlePageLayout({ post, related }: ArticlePageLayoutProps) {
  const articleRef = useRef<HTMLElement>(null)

  return (
    <>
      <ReadingProgressBar articleRef={articleRef} />

      <ArticleHero post={post} />

      <article ref={articleRef}>
        <ArticleContent content={post.content} />
        <ShareButtons title={post.title} slug={post.slug} />
      </article>

      <RelatedArticles posts={related} />
      <NewsletterBand />

      {/* Back to blog link */}
      <div className="max-w-[1280px] mx-auto px-[var(--container-px)] py-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-body text-[length:var(--text-small)] text-secondary hover:text-accent transition-colors duration-[var(--duration-fast)]"
        >
          ← Volver al blog
        </Link>
      </div>
    </>
  )
}
