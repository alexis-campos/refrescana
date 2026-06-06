'use client'

import Image from '@/components/ui/Img'
import Link from '@/components/ui/NavLink'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui'

const bgImg = '/vistas/home/Tingo2.jpg'

export function CTAFinal() {
  return (
    <section className="relative py-[var(--section)] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src={bgImg} alt="" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-primary/60" />
      </div>
      <div className="container relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-medium text-accent text-sm uppercase tracking-[0.2em] mb-4"
          >
            Tu bienestar empieza aquí
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-bg text-[length:var(--text-h1)] leading-tight tracking-tight mb-6"
          >
            Descubre la pureza{' '}
            <span className="italic">de la selva peruana</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-body text-bg/70 text-[length:var(--text-body)] leading-relaxed mb-10"
          >
            Explora nuestro catálogo de productos naturales y encuentra la solución ideal para tu bienestar, nutrición y cuidado personal.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button asChild size="lg">
              <Link href="/productos">Ver productos</Link>
            </Button>
            <Button variant="secondary" asChild size="lg">
              <Link href="/contacto" className="!border-bg/40 !text-bg">Contáctanos</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
