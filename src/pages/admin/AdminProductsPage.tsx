'use client'

import { useState, useEffect, useCallback } from 'react'
import ProductManager from '@/components/admin/ProductManager'
import { api } from '@/lib/api/endpoints'
import type { Product, Category } from '@/types/api'

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const [prods, cats] = await Promise.all([
        api.admin.products.list(),
        api.admin.categories.list(),
      ])
      setProducts(prods.map((p) => ({ ...p, price: Number(p.price) })))
      setCategories(cats)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-[#1C442A]/20 border-t-[#1C442A] rounded-full animate-spin" />
    </div>
  )

  return (
    <ProductManager
      initialProducts={products}
      categories={categories}
      onRefresh={load}
    />
  )
}
