'use client'

import Image from '@/components/ui/Img'
import Link from '@/components/ui/NavLink'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui'
import { usePreloader } from '@/components/layout/PreloaderContext'

const heroImg = '/hero/hero-1.jpg'

export function HeroSection() {
  const { isPreloaderDone } = usePreloader()

  return (
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImg}
          alt="Naturaleza de la selva peruana"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-primary/20" />
      </div>

      {/* Content */}
      <div className="container relative z-10">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isPreloaderDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-medium text-accent text-sm uppercase tracking-[0.2em] mb-4"
          >
            Productos Naturales de la Selva Peruana
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={isPreloaderDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-bg text-[length:var(--text-hero)] leading-[1.05] tracking-tight mb-6"
          >
            De la naturaleza{' '}
            <span className="italic">a tu bienestar</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isPreloaderDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-body text-bg/80 text-[length:var(--text-body)] leading-relaxed max-w-lg mb-8"
          >
            Jarabes artesanales, aceites esenciales, harinas y derivados de la caña de azúcar. Productos de alta pureza para mejorar el bienestar integral de tu familia.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isPreloaderDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4"
          >
            <Button asChild size="lg">
              <Link href="/productos">Conoce nuestros productos</Link>
            </Button>
            <Button variant="secondary" asChild size="lg">
              <Link href="/contacto" className="!border-bg/40 !text-bg">Contáctanos</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isPreloaderDone ? { opacity: 1 } : {}}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="font-body text-xs text-bg/50 uppercase tracking-widest">Descubre</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-bg/30"
        />
      </motion.div>
    </section>
  )
}
