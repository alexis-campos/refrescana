'use client'

import Link from '@/components/ui/NavLink'
import { ScrollReveal } from '@/components/animations'
import { Button, Heading, Text } from '@/components/ui'

export function CTAProyectos() {
  return (
    <section className="py-[var(--section)] px-[var(--container-px)] bg-primary">
      <div className="max-w-[1280px] mx-auto text-center">
        <ScrollReveal>
          <Heading level={2} className="mb-6 max-w-2xl mx-auto text-bg">
            ¿Quieres conocer nuestros productos?
          </Heading>
          <Text className="text-bg/70 mb-10 max-w-lg mx-auto">
            Descubre la pureza de nuestros productos naturales y encuentra el ideal para tu bienestar.
          </Text>
          <Button asChild variant="primary" size="lg">
            <Link href="/productos">Ver productos →</Link>
          </Button>
        </ScrollReveal>
      </div>
    </section>
  )
}
