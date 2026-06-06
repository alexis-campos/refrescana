'use client'

import { useState, useEffect, useCallback } from 'react'
import CategoryManager from '@/components/admin/CategoryManager'
import { api } from '@/lib/api/endpoints'
import type { Category } from '@/types/api'

interface CategoryWithCount extends Category {
  _count?: { products: number }
}

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const cats = await api.admin.categories.list()
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
    <CategoryManager
      initialCategories={categories}
      onRefresh={load}
    />
  )
}
