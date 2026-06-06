'use client'

import { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArticlePageLayout } from '@/components/sections/blog'
import { Breadcrumbs } from '@/components/ui'
import { api } from '@/lib/api/endpoints'
import { ApiError } from '@/lib/api/http'
import type { BlogPost as ApiPost } from '@/types/api'
import type { BlogPost } from '@/types/blog'

function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, '')
}

function toComponentPost(post: ApiPost): BlogPost {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: stripHtml(post.content).substring(0, 160) + '...',
    image: post.imageUrl || '/vistas/valles.png',
    category: 'novedades',
    author: 'Refrescaña',
    publishedAt: post.createdAt,
    readingTime: Math.max(1, Math.ceil(stripHtml(post.content).split(' ').length / 200)) + ' min',
    featured: false,
    tags: ['Refrescaña'],
  }
}

export function BlogDetallePage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [related, setRelated] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    Promise.all([api.public.blogBySlug(slug), api.public.blog()])
      .then(([detail, all]) => {
        setPost(toComponentPost(detail))
        setRelated(
          all
            .filter((p) => p.slug !== slug)
            .slice(0, 3)
            .map(toComponentPost)
        )
      })
      .catch((e) => {
        if (e instanceof ApiError && e.status === 404) setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (notFound) return <Navigate to="/404" replace />
  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  )
  if (!post) return null

  return (
    <>
      <Helmet>
        <title>{post.title} — Blog Refrescaña</title>
        <meta name="description" content={stripHtml(post.content).slice(0, 160)} />
      </Helmet>
      <main className="bg-bg">
        <div className="max-w-[1280px] mx-auto px-[var(--container-px)] pt-[calc(64px+1rem)] pb-3">
          <Breadcrumbs
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: post.title },
            ]}
          />
        </div>
        <ArticlePageLayout post={post} related={related} />
      </main>
    </>
  )
}
