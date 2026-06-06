'use client'

import { motion } from 'framer-motion'

const PILARES = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
    ),
    title: 'Pureza Natural',
    description: 'Cada producto pasa por rigurosos controles de calidad. Sin aditivos, sin conservantes, sin químicos, solo la esencia pura de la naturaleza peruana.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
    ),
    title: 'Tradición Artesanal',
    description: 'Procesos heredados de generaciones de productores de la selva peruana, combinados con estándares modernos de producción y empaque.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
    ),
    title: 'Bienestar Integral',
    description: 'Diseñados para mejorar la nutrición, el cuidado personal y la salud de las familias. Conectamos a las personas con la esencia de la naturaleza.',
  },
]

export function PropuestaDeValor() {
  return (
    <section className="py-[var(--section)]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <p className="font-serif font-medium text-accent text-sm uppercase tracking-[0.2em] mb-4">
            Nuestra Esencia
          </p>
          <h2 className="font-display font-bold text-text text-[length:var(--text-h1)] leading-tight tracking-tight">
            ¿Por qué <span className="text-primary italic">Refrescaña</span>?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {PILARES.map((pilar, i) => (
            <motion.div
              key={pilar.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 text-secondary mb-6 group-hover:bg-secondary group-hover:text-bg transition-all duration-300">
                {pilar.icon}
              </div>
              <h3 className="font-display font-semibold text-text text-[length:var(--text-h3)] mb-3">
                {pilar.title}
              </h3>
              <p className="font-body text-text-muted text-[length:var(--text-body)] leading-relaxed">
                {pilar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
