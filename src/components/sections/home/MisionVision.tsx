'use client'

import Image from '@/components/ui/Img'
import { motion } from 'framer-motion'
import { ScrollReveal } from '@/components/animations'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

export function MisionVision() {
  return (
    <section className="py-[var(--section)] bg-surface overflow-hidden">
      <div className="container">
        {/* Section header */}
        <ScrollReveal className="text-center mb-16">
          <p className="font-serif font-medium text-accent text-sm uppercase tracking-[0.2em] mb-4">
            Lo que nos mueve
          </p>
          <h2 className="font-display font-bold text-text text-[length:var(--text-h1)] leading-tight tracking-tight">
            Nuestra <span className="text-secondary italic">razón de ser</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Misión */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative bg-bg rounded-[var(--radius-2xl)] p-8 lg:p-12 group hover:shadow-[var(--shadow-lg)] transition-shadow duration-500"
          >
            {/* Decorative accent */}
            <div className="absolute top-0 left-8 lg:left-12 w-12 h-1 bg-accent rounded-b-full" />

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-bg transition-all duration-300 text-secondary">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-text text-[length:var(--text-h2)] tracking-tight">
                Misión
              </h3>
            </div>

            <p className="font-body text-text-muted text-[length:var(--text-body)] leading-relaxed">
              Brindar a nuestros clientes alternativas naturales y artesanales para su cuidado
              personal y nutrición, garantizando la pureza de productos como jarabes naturales,
              aceites esenciales, harinas y derivados, diseñados para mejorar el bienestar integral
              de las familias.
            </p>

            {/* Logo watermark */}
            <div className="absolute bottom-6 right-6 opacity-[0.04]">
              <Image
                src="/logo/logo.webp"
                alt=""
                width={80}
                height={80}
                className="object-contain"
                aria-hidden="true"
              />
            </div>
          </motion.div>

          {/* Visión */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="relative bg-primary rounded-[var(--radius-2xl)] p-8 lg:p-12 group hover:shadow-[var(--shadow-lg)] transition-shadow duration-500"
          >
            {/* Decorative accent */}
            <div className="absolute top-0 left-8 lg:left-12 w-12 h-1 bg-accent rounded-b-full" />

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent transition-all duration-300 text-accent group-hover:text-primary">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-bg text-[length:var(--text-h2)] tracking-tight">
                Visión
              </h3>
            </div>

            <p className="font-body text-bg/75 text-[length:var(--text-body)] leading-relaxed">
              Ser la empresa embajadora de la riqueza natural del Perú en el mercado nacional
              e internacional, transformando la percepción del cuidado personal y la nutrición
              a través de productos sostenibles que conectan a las personas con la esencia
              de la naturaleza.
            </p>

            {/* Logo watermark */}
            <div className="absolute bottom-6 right-6 opacity-[0.06]">
              <Image
                src="/logo/logo.webp"
                alt=""
                width={80}
                height={80}
                className="object-contain brightness-[10]"
                aria-hidden="true"
              />
            </div>
          </motion.div>
        </div>

        {/* Empresa info bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          className="mt-12 bg-bg rounded-[var(--radius-xl)] p-6 lg:p-8 border border-[var(--color-border)]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="font-body text-xs text-text-muted uppercase tracking-wider mb-1">Razón Social</p>
              <p className="font-body text-sm text-text font-medium">Princesa Inka Nature SAC</p>
            </div>
            <div>
              <p className="font-body text-xs text-text-muted uppercase tracking-wider mb-1">RUC</p>
              <p className="font-body text-sm text-text font-medium">20613282620</p>
            </div>
            <div>
              <p className="font-body text-xs text-text-muted uppercase tracking-wider mb-1">Sector</p>
              <p className="font-body text-sm text-text font-medium">Agroindustrial / Productos Naturales</p>
            </div>
            <div>
              <p className="font-body text-xs text-text-muted uppercase tracking-wider mb-1">Mercados</p>
              <p className="font-body text-sm text-text font-medium">Local, Regional, Nacional</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
