'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollReveal } from '@/components/animations'
import { Heading, Text } from '@/components/ui'
import { cn } from '@/lib/utils'

type Ring = 'why' | 'how' | 'what'

const HOW_ITEMS = [
  'Materias primas seleccionadas de la selva peruana',
  'Procesos artesanales que garantizan la pureza',
  'Productos sin aditivos ni conservantes',
  'Control de calidad riguroso en cada lote',
  'Empaques sostenibles y diseño premium',
  'Distribución local, regional y proyección internacional',
]

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

export function GoldenCircle() {
  const [active, setActive] = useState<Ring | null>('why')

  const handleRingClick = (ring: Ring) => {
    setActive((prev) => (prev === ring ? null : ring))
  }

  return (
    <section className="py-[var(--section)] px-[var(--container-px)] bg-surface">
      <div className="max-w-[1280px] mx-auto">
        <ScrollReveal className="mb-[var(--section-sm)]">
          <Heading level={2} className="mb-4">
            Nuestro ADN
          </Heading>
          <Text className="text-text-muted max-w-lg">
            Tres preguntas que definen todo lo que hacemos. Haz clic en cada anillo para explorar.
          </Text>

        </ScrollReveal>

        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Concentric rings */}
          <div
            className="relative flex items-center justify-center shrink-0 w-full max-w-xs lg:w-80 lg:max-w-none aspect-square"
            aria-label="Golden Circle interactivo"
          >
            {/* Outer ring — WHY */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0, ease: EASE }}
              onClick={() => handleRingClick('why')}
              className={cn(
                'absolute inset-0 rounded-full border-2 cursor-pointer',
                'transition-all duration-300',
                active === 'why'
                  ? 'border-accent bg-accent/10 scale-105'
                  : active !== null
                    ? 'border-accent/30 opacity-40'
                    : 'border-accent hover:bg-accent/5',
              )}
              aria-pressed={active === 'why'}
              aria-label="¿Por qué?"
            >
              <span className="absolute top-5 left-1/2 -translate-x-1/2 font-body text-xs uppercase tracking-wider text-accent pointer-events-none">
                ¿POR QUÉ?
              </span>
            </motion.button>

            {/* Middle ring — HOW */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              onClick={() => handleRingClick('how')}
              className={cn(
                'absolute rounded-full border-2 cursor-pointer',
                'transition-all duration-300',
                active === 'how'
                  ? 'border-secondary bg-secondary/10 scale-105'
                  : active !== null
                    ? 'border-secondary/30 opacity-40'
                    : 'border-secondary hover:bg-secondary/5',
              )}
              style={{ inset: '16%' }}
              aria-pressed={active === 'how'}
              aria-label="¿Cómo?"
            >
              <span className="absolute top-4 left-1/2 -translate-x-1/2 font-body text-xs uppercase tracking-wider text-secondary pointer-events-none">
                ¿CÓMO?
              </span>
            </motion.button>

            {/* Inner ring — WHAT */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
              onClick={() => handleRingClick('what')}
              className={cn(
                'absolute rounded-full border-2 cursor-pointer flex items-center justify-center',
                'transition-all duration-300',
                active === 'what'
                  ? 'border-primary bg-primary/10 scale-105'
                  : active !== null
                    ? 'border-primary/30 opacity-40'
                    : 'border-primary hover:bg-primary/5',
              )}
              style={{ inset: '32%' }}
              aria-pressed={active === 'what'}
              aria-label="¿Qué?"
            >
              <span className="font-body text-xs uppercase tracking-wider text-primary pointer-events-none">
                ¿QUÉ?
              </span>
            </motion.button>
          </div>

          {/* Content panel */}
          <div className="flex-1 min-h-[220px] flex items-center">
            <AnimatePresence mode="wait">
              {active === 'why' && (
                <motion.div
                  key="why"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <span className="font-body text-xs uppercase tracking-wider text-accent mb-4 block">
                    Nuestra Misión
                  </span>
                  <Heading level={3} className="mb-6">
                    Alternativas naturales para el bienestar integral
                  </Heading>
                  <Text className="text-text-muted leading-relaxed">
                    Brindar a nuestros clientes alternativas naturales y artesanales para su cuidado personal
                    y nutrición, garantizando la pureza de productos como jarabes naturales, aceites esenciales,
                    harinas y derivados, diseñados para mejorar el bienestar integral de las familias.
                  </Text>
                </motion.div>
              )}

              {active === 'how' && (
                <motion.div
                  key="how"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <span className="font-body text-xs uppercase tracking-wider text-secondary mb-4 block">
                    ¿Cómo?
                  </span>
                  <Heading level={3} className="mb-6">
                    Con pureza y tradición artesanal
                  </Heading>
                  <ul className="space-y-3">
                    {HOW_ITEMS.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.07, ease: EASE }}
                        className="flex items-start gap-3"
                      >
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                        <Text size="body" className="text-text-muted">
                          {item}
                        </Text>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {active === 'what' && (
                <motion.div
                  key="what"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <span className="font-body text-xs uppercase tracking-wider text-primary mb-4 block">
                    Nuestra Visión
                  </span>
                  <Heading level={3} className="mb-6">
                    Embajadores de la riqueza natural del Perú
                  </Heading>
                  <Text className="text-text-muted leading-relaxed">
                    Ser la empresa embajadora de la riqueza natural del Perú en el mercado nacional e internacional,
                    transformando la percepción del cuidado personal y la nutrición a través de productos sostenibles
                    que conectan a las personas con la esencia de la naturaleza.
                  </Text>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
