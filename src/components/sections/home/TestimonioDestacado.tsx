'use client'

import { motion } from 'framer-motion'
import { MOCK_TESTIMONIALS } from '@/lib/mock-data'

export function TestimonioDestacado() {
  const testimonial = MOCK_TESTIMONIALS.find(t => t.featured) ?? MOCK_TESTIMONIALS[0]

  return (
    <section className="py-[var(--section)] bg-surface">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--color-accent)" className="mx-auto mb-8 opacity-30"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" /></svg>
            <blockquote className="font-serif font-normal italic text-text text-[length:var(--text-h2)] leading-relaxed mb-8">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <div>
              <p className="font-body font-semibold text-text">{testimonial.clientName}</p>
              {testimonial.productName && (
                <p className="font-body text-sm text-text-muted mt-1">Sobre: {testimonial.productName}</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
