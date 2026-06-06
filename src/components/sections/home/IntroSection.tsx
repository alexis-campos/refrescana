'use client'

import { motion } from 'framer-motion'
import { ScrollReveal } from '@/components/animations'
import { CounterAnimation } from '@/components/animations'

const STATS = [
  { value: 40, suffix: '+', label: 'Productos Naturales' },
  { value: 6, suffix: '', label: 'Categorías' },
  { value: 100, suffix: '%', label: 'Artesanal' },
  { value: 3, suffix: '', label: 'Regiones Atendidas' },
]

export function IntroSection() {
  return (
    <section className="py-[var(--section)] bg-surface">
      <div className="container">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="font-serif font-medium text-accent text-sm uppercase tracking-[0.2em] mb-4">
              Quiénes Somos
            </p>
            <h2 className="font-display font-bold text-text text-[length:var(--text-h1)] leading-tight tracking-tight mb-6">
              Alternativas naturales para tu{' '}
              <span className="text-secondary italic">bienestar integral</span>
            </h2>
            <p className="font-body text-text-muted text-[length:var(--text-body)] leading-relaxed">
              Somos una empresa agroindustrial dedicada a la producción, transformación y
              comercialización de productos naturales de alta pureza y calidad, directamente
              desde la selva peruana, para ofrecer soluciones de bienestar, nutrición y cuidado personal.
            </p>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center py-6"
            >
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="font-display font-bold text-primary text-[clamp(2rem,4vw,3.5rem)] leading-none">
                  <CounterAnimation value={stat.value} />
                </span>
                {stat.suffix && (
                  <span className="font-display font-bold text-accent text-[clamp(1.25rem,2vw,2rem)]">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <p className="font-body text-sm text-text-muted mt-2 uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
