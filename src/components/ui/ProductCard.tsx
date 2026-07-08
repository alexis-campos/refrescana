'use client'

import Link from '@/components/ui/NavLink'
import Image from '@/components/ui/Img'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ClientProduct } from '@/components/sections/productos/ProductosContent'
import { useCartStore } from '@/lib/store/useCartStore'

interface ProductCardProps {
  product: ClientProduct
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // prevent navigating to product details
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px' }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.2), ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/productos/${product.slug}`} className="group block h-full">
        <div className="relative flex flex-col h-full overflow-hidden rounded-[var(--radius-xl)] bg-surface shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-hover)] transition-shadow duration-300">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-gray-50 flex-shrink-0">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            )}
            {/* Category badge */}
            <span className="absolute top-3 left-3 px-3 py-1 text-xs font-body font-medium bg-primary/90 text-bg rounded-[var(--radius-full)] backdrop-blur-sm">
              {product.category}
            </span>
            {/* Status badge */}
            {product.stock <= 0 && (
              <span className="absolute top-3 right-3 px-3 py-1 text-xs font-body font-medium bg-red-600/90 text-white rounded-[var(--radius-full)] backdrop-blur-sm">
                Agotado
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            <h3 className="font-display font-semibold text-text text-base leading-snug mb-1 group-hover:text-primary transition-colors duration-200 line-clamp-2">
              {product.name}
            </h3>
            <p className="font-body text-sm text-text-muted mb-3 line-clamp-2 flex-1">
              {product.description}
            </p>
            <div className="flex items-center justify-between mb-4">
              <span className="font-body font-bold text-[#1C442A] text-lg">
                S/ {product.price.toFixed(2)}
              </span>
            </div>
            {/* CTA */}
            <div className="mt-auto pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
              <span className="font-body text-sm font-medium text-text-muted group-hover:text-primary transition-colors duration-200">
                Ver detalle
              </span>
              <button 
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-10 h-10 rounded-full bg-[#f0fdf4] text-[#1C442A] flex items-center justify-center hover:bg-[#1C442A] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
                title="Añadir al carrito"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
