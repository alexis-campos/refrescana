'use client'

import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { FeaturedArticle, BlogListSection } from '@/components/sections/blog'
import { api } from '@/lib/api/endpoints'
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

export function BlogPage() {
  const [featured, setFeatured] = useState<BlogPost | null>(null)
  const [list, setList] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.public.blog()
      .then((posts) => {
        const mapped = posts.map(toComponentPost)
        setFeatured(mapped[0] ?? null)
        setList(mapped.slice(1))
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Helmet>
        <title>Blog — Refrescaña</title>
        <meta name="description" content="Artículos sobre bienestar natural, recetas saludables, beneficios de productos naturales y novedades de Refrescaña." />
      </Helmet>
      <main className="bg-bg">
        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : featured ? (
          <FeaturedArticle post={featured} isHero />
        ) : (
          <div className="pt-32 pb-20 text-center">
            <h1 className="text-4xl text-primary font-bold">Próximamente</h1>
          </div>
        )}
        <BlogListSection posts={list} />
      </main>
    </>
  )
}
