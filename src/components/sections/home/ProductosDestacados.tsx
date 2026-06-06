'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '@/components/ui'
import { Button } from '@/components/ui'
import { api } from '@/lib/api/endpoints'
import type { Product } from '@/types/api'
import type { ClientProduct } from '@/components/sections/productos/ProductosContent'

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

export function ProductosDestacados() {
  const [featured, setFeatured] = useState<ClientProduct[]>([])

  useEffect(() => {
    api.public.homeData()
      .then((data) => setFeatured(data.featuredProducts.slice(0, 3).map(toClientProduct)))
      .catch(() => {
        // Falla silenciosa: la sección queda vacía
      })
  }, [])

  if (featured.length === 0) return null

  return (
    <section className="py-[var(--section)] bg-surface">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <p className="font-serif font-medium text-accent text-sm uppercase tracking-[0.2em] mb-3">
              Catálogo
            </p>
            <h2 className="font-display font-bold text-text text-[length:var(--text-h1)] leading-tight tracking-tight">
              Productos <span className="text-secondary italic">destacados</span>
            </h2>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/productos">Ver todos los productos →</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
