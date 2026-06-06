'use client'

import { motion } from 'framer-motion'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const HORARIOS = [
  { dia: 'Lunes — Viernes', hora: '9:00 am – 6:00 pm', activo: true },
  { dia: 'Sábados',         hora: '9:00 am – 1:00 pm', activo: true },
  { dia: 'Domingos',        hora: 'Cerrado',            activo: false },
]

function SocialButton({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-11 h-11 rounded-full border border-[var(--color-border)] text-text/50 hover:border-primary hover:text-primary hover:bg-primary/5 flex items-center justify-center transition-all duration-200 group"
    >
      {children}
    </a>
  )
}

export function MapaInfo() {
  return (
    <section className="py-[var(--section)] bg-bg overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-16 items-stretch">

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative rounded-[var(--radius-2xl)] overflow-hidden aspect-[4/3] lg:aspect-auto min-h-[400px]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d569.6008033285127!2d-75.90864998047529!3d-9.276409235719083!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zOcKwMTYnMzUuMiJTIDc1wrA1NCczMC40Ilc!5e0!3m2!1ses-419!2spe!4v1779505412020!5m2!1ses-419!2spe"
              className="absolute inset-0 w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Refrescaña — Tingo María"
            />
            {/* Overlay gradient at bottom */}
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-bg/30 to-transparent pointer-events-none" />
          </motion.div>

          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="flex flex-col justify-between gap-8"
          >

            {/* Location */}
            <div>
              <p className="font-serif font-medium text-accent text-sm uppercase tracking-[0.2em] mb-5">
                Nuestra ubicación
              </p>
              <div className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22S5 15.5 5 9A7 7 0 0119 9C19 15.5 12 22 12 22Z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                </span>
                <div>
                  <p className="font-body font-semibold text-text text-[length:var(--text-body)]">
                    Tingo María
                  </p>
                  <p className="font-body text-sm text-text-muted mt-0.5">
                    Leoncio Prado, Huánuco — Perú
                  </p>
                  <a
                    href="https://maps.app.goo.gl/example"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 font-body text-xs text-primary font-medium hover:text-secondary transition-colors duration-200 group"
                  >
                  </a>
                </div>
              </div>
            </div>

            <div className="h-px bg-[var(--color-border)]" />

            {/* Hours */}
            <div>
              <p className="font-serif font-medium text-accent text-sm uppercase tracking-[0.2em] mb-5">
                Horarios de atención
              </p>
              <ul className="space-y-3">
                {HORARIOS.map((h) => (
                  <li key={h.dia} className="flex items-center justify-between gap-4">
                    <span className={`font-body text-sm ${h.activo ? 'text-text' : 'text-text/35'}`}>
                      {h.dia}
                    </span>
                    <span className={`font-body text-sm font-medium tabular-nums ${h.activo ? 'text-primary' : 'text-text/30'}`}>
                      {h.hora}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="h-px bg-[var(--color-border)]" />

            {/* Social */}
            <div>
              <p className="font-serif font-medium text-accent text-sm uppercase tracking-[0.2em] mb-5">
                Síguenos
              </p>
              <div className="flex items-center gap-3">
                <SocialButton href="https://www.instagram.com/refrescana_pe" label="Instagram de Refrescaña">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
                  </svg>
                </SocialButton>

                <SocialButton href="https://www.facebook.com/profile.php?id=61560760616214" label="Facebook de Refrescaña">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </SocialButton>

                <SocialButton href={`https://wa.me/51927137728`} label="WhatsApp de Refrescaña">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5C21 16.75 16.75 21 11.5 21c-1.4 0-2.74-.31-3.93-.87L3 22l1.9-4.58C3.7 16.22 3 14.56 3 12.73 3 7.48 7.25 3 12.5 3S22 7.25 22 12.5" />
                    <path d="M9 11h.01M12 11h.01M15 11h.01" strokeWidth="2.5" />
                  </svg>
                </SocialButton>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  )
}
