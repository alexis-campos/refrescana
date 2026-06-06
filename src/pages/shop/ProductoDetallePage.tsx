'use client'

import { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { api } from '@/lib/api/endpoints'
import { ApiError } from '@/lib/api/http'
import type { Product } from '@/types/api'
import type { ClientProduct } from '@/components/sections/productos/ProductosContent'
import { ProductoDetalle } from '@/components/sections/productos/ProductoDetalle'

function toClientProduct(p: Product): ClientProduct {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: Number(p.price),
    stock: p.stock,
    category: p.category?.name ?? '',
    categoryId: p.categoryId,
    image: p.images?.[0]?.url ?? '',
  }
}

export function ProductoDetallePage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<ClientProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    api.public.productBySlug(slug)
      .then((p) => setProduct(toClientProduct(p)))
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
  if (!product) return null

  return (
    <>
      <Helmet>
        <title>{product.name} — Refrescaña</title>
        <meta name="description" content={product.description.slice(0, 160)} />
      </Helmet>
      <ProductoDetalle product={product} />
    </>
  )
}
