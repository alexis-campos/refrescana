'use client'

import { motion } from 'framer-motion'
import Link from '@/components/ui/NavLink'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const CIUDADES = [
  {
    num: '01',
    ciudad: 'Tingo María',
    region: 'Huánuco · Leoncio Prado',
    dark: true,
    tiendas: [
      { nombre: 'Minimarket Minisol',   direccion: 'Av. Tito Jaime 475' },
      { nombre: 'Minimarket Lukita',    direccion: 'Jr. Julio Burga 307' },
      { nombre: 'Minimarket Baraton',   direccion: 'Av. Enrique Pimentel 644' },
      { nombre: 'Supermercado Kalidda', direccion: 'Jr. Francisco Bolognesi 126' },
    ],
  },
  {
    num: '02',
    ciudad: 'Huánuco',
    region: 'Huánuco · Huánuco',
    dark: false,
    tiendas: [
      { nombre: 'Linderos Ecológicos', direccion: 'Jr. Dos de Mayo 1206' },
    ],
  },
]

export function PuntosDeVenta() {
  return (
    <section className="py-[var(--section)] bg-surface overflow-hidden">
      <div className="container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center mb-16"
        >
          <p className="font-serif font-medium text-accent text-sm uppercase tracking-[0.2em] mb-4">
            Dónde encontrarnos
          </p>
          <h2 className="font-display font-bold text-text text-[length:var(--text-h1)] leading-tight tracking-tight">
            Puntos de <span className="text-secondary italic">venta</span>
          </h2>
        </motion.div>

        {/* City blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {CIUDADES.map((c, ci) => (
            <motion.div
              key={c.ciudad}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: ci * 0.15, ease: EASE }}
              className={`relative rounded-[var(--radius-2xl)] p-8 lg:p-12 overflow-hidden group hover:shadow-[var(--shadow-lg)] transition-shadow duration-500 ${
                c.dark
                  ? 'bg-primary'
                  : 'bg-bg border border-[var(--color-border)]'
              }`}
            >
              {/* Top accent bar */}
              <div className="absolute top-0 left-8 lg:left-12 w-16 h-1 bg-accent rounded-b-full" />

              {/* Decorative large number */}
              <span
                className={`absolute bottom-4 right-6 font-display font-bold text-[8rem] leading-none select-none pointer-events-none transition-opacity duration-300 ${
                  c.dark ? 'text-white/[0.04] group-hover:text-white/[0.07]' : 'text-text/[0.04] group-hover:text-text/[0.07]'
                }`}
              >
                {c.num}
              </span>

              {/* City header */}
              <div className="mb-8">
                <p className={`font-body text-xs uppercase tracking-[0.2em] mb-2 ${c.dark ? 'text-accent' : 'text-accent'}`}>
                  {c.region}
                </p>
                <h3
                  className={`font-display font-bold text-[length:var(--text-h2)] tracking-tight ${
                    c.dark ? 'text-bg' : 'text-text'
                  }`}
                >
                  {c.ciudad}
                </h3>
              </div>

              {/* Stores list */}
              <ul className="space-y-0 divide-y divide-white/10">
                {c.tiendas.map((t, ti) => (
                  <motion.li
                    key={t.nombre}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: ci * 0.15 + 0.2 + ti * 0.08, ease: EASE }}
                    className={`flex items-start gap-4 py-4 ${
                      !c.dark ? 'divide-[var(--color-border)]' : ''
                    }`}
                  >
                    {/* Accent dot */}
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <div>
                      <p
                        className={`font-body font-semibold text-[length:var(--text-body)] leading-snug ${
                          c.dark ? 'text-bg' : 'text-text'
                        }`}
                      >
                        {t.nombre}
                      </p>
                      <p
                        className={`font-body text-sm mt-0.5 ${
                          c.dark ? 'text-bg/55' : 'text-text-muted'
                        }`}
                      >
                        {t.direccion}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>

              {/* Store count badge */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className={`font-body text-xs uppercase tracking-[0.15em] ${c.dark ? 'text-bg/40' : 'text-text-muted'}`}>
                  {c.tiendas.length} {c.tiendas.length === 1 ? 'punto de venta' : 'puntos de venta'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
          className="mt-12 text-center"
        >
          <p className="font-body text-text-muted text-[length:var(--text-body)]">
            ¿Quieres ser punto de venta o distribuidor?{' '}
            <Link
              href="/contacto"
              className="text-primary font-semibold hover:text-secondary transition-colors duration-200 inline-flex items-center gap-1 group"
            >
              Contáctanos
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </p>
        </motion.div>

      </div>
    </section>
  )
}
