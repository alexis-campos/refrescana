'use client'

import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { ProductosHero, ProductosContent } from '@/components/sections/productos'
import type { ClientProduct } from '@/components/sections/productos/ProductosContent'
import { api } from '@/lib/api/endpoints'
import type { Product, Category } from '@/types/api'

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

export function ProductosPage() {
  const [products, setProducts] = useState<ClientProduct[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.public.products(), api.public.categories()])
      .then(([prods, cats]) => {
        setProducts(prods.map(toClientProduct))
        setCategories(cats)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Helmet>
        <title>Productos — Refrescaña</title>
        <meta name="description" content="Explora nuestra línea completa de productos naturales artesanales: jarabes, aceites, harinas y más." />
      </Helmet>
      <ProductosHero />
      {!loading && (
        <ProductosContent initialProducts={products} categories={categories} />
      )}
    </>
  )
}
