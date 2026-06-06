'use client'

import Image from '@/components/ui/Img'
import { motion } from 'framer-motion'
import { heroImg2, heroImg3, heroImg4, heroImg5, heroImg6 } from '@/lib/mock-data'

const FEED_ITEMS = [
  { image: heroImg2, alt: 'Productos naturales Refrescaña' },
  { image: heroImg3, alt: 'Aceites esenciales' },
  { image: heroImg4, alt: 'Miel de caña artesanal' },
  { image: heroImg5, alt: 'Naturaleza peruana' },
  { image: heroImg6, alt: 'Proceso artesanal' },
]

export function InstagramFeed() {
  return (
    <section className="py-[var(--section)]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <p className="font-serif font-medium text-accent text-sm uppercase tracking-[0.2em] mb-3">
            Síguenos
          </p>
          <h2 className="font-display font-bold text-text text-[length:var(--text-h2)] leading-tight tracking-tight">
            #Refrescaña
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {FEED_ITEMS.map((item, i) => (
            <motion.a
              key={i}
              href="https://www.instagram.com/refrescana_pe"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-square rounded-[var(--radius-lg)] overflow-hidden group"
            >
              <Image src={item.image} alt={item.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors duration-300 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="white" stroke="none" /></svg>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
