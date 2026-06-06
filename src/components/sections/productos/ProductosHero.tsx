'use client'

import Image from '@/components/ui/Img'
import { motion } from 'framer-motion'

const heroImg = '/hero/hero-3.jpg'

export function ProductosHero() {
  return (
    <section className="relative h-[50vh] min-h-[400px] flex items-end overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src={heroImg} alt="Productos naturales" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-primary/20" />
      </div>
      <div className="container relative z-10 pb-12">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif font-medium text-accent text-sm uppercase tracking-[0.2em] mb-3"
        >
          Catálogo
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold text-bg text-[length:var(--text-h1)] leading-tight tracking-tight"
        >
          Nuestros <span className="italic">Productos</span>
        </motion.h1>
      </div>
    </section>
  )
}
