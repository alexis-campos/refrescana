'use client'

import { motion } from 'framer-motion'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const WHATSAPP_TEXT = encodeURIComponent('Hola, me gustaría conocer más sobre sus productos Refrescaña')

const CANALES = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    value: '+51 927 137 728',
    hint: 'Respuesta en minutos',
    href: `https://wa.me/51927137728?text=${WHATSAPP_TEXT}`,
    external: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5C21 16.75 16.75 21 11.5 21c-1.4 0-2.74-.31-3.93-.87L3 22l1.9-4.58C3.7 16.22 3 14.56 3 12.73 3 7.48 7.25 3 12.5 3S22 7.25 22 12.5" />
        <path d="M9 11h.01M12 11h.01M15 11h.01" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    id: 'telefono',
    label: 'Teléfono',
    value: '+51 927 137 728',
    hint: 'Lun–Vie 9am – 6pm',
    href: 'tel:+51927137728',
    external: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
  },
  {
    id: 'email',
    label: 'Correo electrónico',
    value: 'rolinaquino09@gmail.com',
    hint: 'Respuesta en 24 horas',
    href: 'mailto:rolinaquino09@gmail.com',
    external: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 7 10-7" />
      </svg>
    ),
  },
]

export function CanalesDirectos() {
  return (
    <section className="bg-primary py-[var(--section)] overflow-hidden">
      <div className="container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-14"
        >
          <p className="font-serif font-medium text-accent text-sm uppercase tracking-[0.2em] mb-4">
            Canales directos
          </p>
          <h2 className="font-display font-bold text-bg text-[length:var(--text-h1)] leading-tight tracking-tight">
            Habla con <span className="text-accent italic">nosotros</span>
          </h2>
        </motion.div>

        {/* Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {CANALES.map((c, i) => (
            <motion.a
              key={c.id}
              href={c.href}
              target={c.external ? '_blank' : undefined}
              rel={c.external ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
              className="group flex flex-col gap-5 px-0 md:px-10 py-8 md:py-0 first:pl-0 last:pr-0 hover:opacity-90 transition-opacity duration-200"
            >
              {/* Icon */}
              <span className="w-12 h-12 rounded-full bg-white/10 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-primary transition-all duration-300">
                {c.icon}
              </span>

              {/* Text */}
              <div>
                <p className="font-body text-xs uppercase tracking-[0.18em] text-bg/40 mb-1.5">
                  {c.label}
                </p>
                <p className="font-display font-semibold text-bg text-[length:var(--text-h3)] leading-tight tracking-tight group-hover:text-accent transition-colors duration-200">
                  {c.value}
                </p>
                <p className="font-body text-sm text-bg/50 mt-1.5">
                  {c.hint}
                </p>
              </div>

              {/* Arrow */}
              <span className="font-body text-sm text-accent/60 group-hover:text-accent transition-colors duration-200 inline-flex items-center gap-1.5 mt-auto">
                Contactar
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </span>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  )
}
