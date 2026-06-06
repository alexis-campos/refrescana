'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductCard } from '@/components/ui'

interface Category {
  id: string;
  name: string;
}

export interface ClientProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  categoryId: string;
  image: string;
}

interface Props {
  initialProducts: ClientProduct[];
  categories: Category[];
}

export function ProductosContent({ initialProducts, categories }: Props) {
  const [filterId, setFilterId] = useState<string>('todos')

  const filtered = filterId === 'todos'
    ? initialProducts
    : initialProducts.filter(p => p.categoryId === filterId)

  return (
    <section className="py-[var(--section)]">
      <div className="container">
        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setFilterId('todos')}
            className={`px-4 py-2 rounded-[var(--radius-full)] font-body text-sm transition-all duration-200 cursor-pointer ${
              filterId === 'todos'
                ? 'bg-primary text-bg'
                : 'bg-surface text-text-muted hover:bg-secondary/10 border border-[var(--color-border)]'
            }`}
          >
            Todos
          </button>
          {categories.map(option => (
            <button
              key={option.id}
              onClick={() => setFilterId(option.id)}
              className={`px-4 py-2 rounded-[var(--radius-full)] font-body text-sm transition-all duration-200 cursor-pointer ${
                filterId === option.id
                  ? 'bg-primary text-bg'
                  : 'bg-surface text-text-muted hover:bg-secondary/10 border border-[var(--color-border)]'
              }`}
            >
              {option.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filterId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-body text-text-muted text-lg">No hay productos en esta categoría.</p>
          </div>
        )}
      </div>
    </section>
  )
}
