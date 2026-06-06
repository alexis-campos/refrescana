'use client'

import Image from '@/components/ui/Img'
import Link from '@/components/ui/NavLink'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui'

const bannerImg = '/vistas/home/servicio.jpg'

export function ServiciosBanner() {
  return (
    <section className="py-[var(--section)] bg-primary">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/3] rounded-[var(--radius-2xl)] overflow-hidden"
          >
            <Image src={bannerImg} alt="Servicios Refrescaña" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-serif font-medium text-accent text-sm uppercase tracking-[0.2em] mb-4">
              Nuestros Servicios
            </p>
            <h2 className="font-display font-bold text-bg text-[length:var(--text-h1)] leading-tight tracking-tight mb-6">
              Más que productos,{' '}
              <span className="text-accent italic">soluciones</span>
            </h2>
            <ul className="space-y-4 mb-8">
              {['Personalización de packs para minimarkets', 'Suministros mayoristas con marca propia', 'Degustaciones en punto de venta', 'Asesoría personalizada por WhatsApp', 'Soporte logístico para revendedores'].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-3 font-body text-bg/80"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>
                  {item}
                </motion.li>
              ))}
            </ul>
            <Button asChild size="lg">
              <Link href="/servicios">Conoce nuestros servicios</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
