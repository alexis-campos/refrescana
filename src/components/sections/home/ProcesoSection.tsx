'use client'

import { motion } from 'framer-motion'

const STEPS = [
  { number: '01', title: 'Cosecha', description: 'Selección cuidadosa de materias primas de la selva peruana, respetando los ciclos naturales y la sostenibilidad.' },
  { number: '02', title: 'Transformación', description: 'Procesos artesanales heredados de generaciones, combinados con estándares modernos de higiene y calidad.' },
  { number: '03', title: 'Purificación', description: 'Control de calidad riguroso en cada lote. Sin aditivos, sin conservantes, solo pureza natural.' },
  { number: '04', title: 'Tu Hogar', description: 'Empaque premium y distribución directa para que disfrutes la frescura de la naturaleza en cada producto.' },
]

export function ProcesoSection() {
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
            Nuestro Proceso
          </p>
          <h2 className="font-display font-bold text-text text-[length:var(--text-h1)] leading-tight tracking-tight">
            De la selva <span className="text-secondary italic">a tu mesa</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="relative group"
            >
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%+0.5rem)] w-[calc(100%-1rem)] h-px bg-[var(--color-border)]" />
              )}
              <span className="font-display font-bold text-accent/20 text-[4rem] leading-none group-hover:text-accent/40 transition-colors duration-300">
                {step.number}
              </span>
              <h3 className="font-display font-semibold text-text text-[length:var(--text-h3)] mt-2 mb-3">
                {step.title}
              </h3>
              <p className="font-body text-text-muted text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
