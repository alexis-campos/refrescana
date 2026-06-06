'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '@/components/ui'
import { AddToCartButton } from '@/components/ui/AddToCartButton'
import { api } from '@/lib/api/endpoints'
import { CONTACT } from '@/lib/constants'
import type { ClientProduct } from './ProductosContent'
import type { Product } from '@/types/api'

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

interface Props {
  product: ClientProduct
}

export function ProductoDetalle({ product }: Props) {
  const [related, setRelated] = useState<ClientProduct[]>([])

  useEffect(() => {
    // Carga productos relacionados desde la misma categoría
    api.public.products({ categoryId: product.categoryId })
      .then((prods) =>
        setRelated(
          prods
            .filter((p) => p.slug !== product.slug)
            .slice(0, 3)
            .map(toClientProduct)
        )
      )
      .catch(() => {/* falla silenciosa */})
  }, [product.categoryId, product.slug])

  const whatsappUrl = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Hola, me interesa el producto: ${product.name}`)}`

  return (
    <main>
      <section className="pt-32 pb-[var(--section-sm)]">
        <div className="container">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 font-body text-sm text-text-muted mb-8">
            <Link to="/" className="hover:text-accent transition-colors">Inicio</Link>
            <span>/</span>
            <Link to="/productos" className="hover:text-accent transition-colors">Productos</Link>
            <span>/</span>
            <span className="text-text">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Imagen */}
            <div className="relative aspect-square rounded-[var(--radius-2xl)] overflow-hidden bg-surface">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-body font-medium bg-primary/90 text-bg rounded-[var(--radius-full)]">
                {product.category}
              </span>
              {product.stock <= 0 && (
                <span className="absolute top-4 right-4 px-3 py-1 text-xs font-body font-medium bg-red-600/90 text-white rounded-[var(--radius-full)]">
                  Agotado
                </span>
              )}
            </div>

            {/* Info */}
            <div>
              <h1 className="font-display font-bold text-text text-[length:var(--text-h1)] leading-tight tracking-tight mb-4">
                {product.name}
              </h1>
              <p className="font-body text-text-muted text-[length:var(--text-body)] leading-relaxed mb-6 whitespace-pre-wrap">
                {product.description}
              </p>

              {/* Precio */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-display font-bold text-primary text-3xl">S/ {product.price.toFixed(2)}</span>
                <span className="font-body text-sm text-text-muted">
                  {product.stock > 0 ? `${product.stock} unidades disponibles` : 'Sin stock'}
                </span>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-8">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white text-[#1C442A] border border-[#1C442A] rounded-full font-medium hover:bg-green-50 transition-colors"
                >
                  Consultar por WhatsApp
                </a>
                <AddToCartButton product={product} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Relacionados */}
      {related.length > 0 && (
        <section className="py-[var(--section-sm)] bg-surface">
          <div className="container">
            <h2 className="font-display font-bold text-text text-[length:var(--text-h2)] mb-8">
              Productos relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
