'use client'

import Link from '@/components/ui/NavLink'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui'

export function ServicioCTA() {
  return (
    <section className="py-[var(--section)] bg-primary">
      <div className="container text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="font-display font-bold text-bg text-[length:var(--text-h1)] leading-tight tracking-tight mb-4">
            ¿Listo para <span className="text-accent italic">trabajar juntos</span>?
          </h2>
          <p className="font-body text-bg/70 text-[length:var(--text-body)] max-w-lg mx-auto mb-8">
            Contáctanos para conocer cómo nuestros servicios pueden impulsar tu negocio con productos naturales de alta calidad.
          </p>
          <Button asChild size="lg"><Link href="/contacto">Contáctanos</Link></Button>
        </motion.div>
      </div>
    </section>
  )
}
