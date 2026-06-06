'use client'

import { ScrollReveal, ParallaxImage, ParallaxVideo } from '@/components/animations'
import { Heading, Text } from '@/components/ui'

const interior1 = { src: '/vistas/nosotros/nosotros-1.webp', width: 1920, height: 1280 }
const interior2 = { src: '/vistas/nosotros/nosotros-2.webm', width: 1920, height: 1280 }
const interior3 = { src: '/vistas/nosotros/nosotros-3.webp', width: 1920, height: 1280 }

export function NuestraHistoria() {
  return (
    <section className="py-[var(--section)] px-[var(--container-px)] bg-bg overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        {/* Section header */}
        <ScrollReveal className="mb-16">
          <Heading level={2}>Nuestra Historia</Heading>
        </ScrollReveal>

        <div className="space-y-[var(--section)]">
          {/* Block 1: text left, image right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal direction="right">
              <Text className="text-[length:var(--text-h3)] font-serif font-light tracking-[-0.015em] leading-relaxed text-text/85">
                Todo comenzó con una conexión profunda con la selva peruana y sus recursos
                naturales. Desde pequeños crecimos rodeados de caña de azúcar, plantas
                medicinales y la sabiduría ancestral de nuestros abuelos.
              </Text>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.15}>
              <div className="relative aspect-[4/3] rounded-[var(--radius-2xl)] overflow-hidden">
                <ParallaxImage
                  src={interior1.src}
                  alt="Naturaleza de la selva peruana"
                  width={interior1.width}
                  height={interior1.height}
                  speed={0.2}
                  className="w-full h-full"
                />
              </div>
            </ScrollReveal>
          </div>

          {/* Block 2: image left, text right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal direction="right" delay={0.1} className="relative order-2 lg:order-1">
              <div className="relative aspect-[3/4] rounded-[var(--radius-2xl)] overflow-hidden">
                <ParallaxVideo
                  src={interior2.src}
                  speed={0.25}
                  className="w-full h-full"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" className="order-1 lg:order-2">
              <Text className="text-[length:var(--text-h3)] font-serif font-light tracking-[-0.015em] leading-relaxed text-text/85">
                De grandes estudiamos, viajamos y nos preparamos para que esa pasión
                por lo natural se convierta en una misión: transformar la percepción del
                cuidado personal y la nutrición a través de productos sostenibles.
              </Text>
            </ScrollReveal>
          </div>

          {/* Block 3: wide text + small image */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <ScrollReveal className="lg:col-span-2">
              <Text className="text-[length:var(--text-h3)] font-serif font-light tracking-[-0.015em] leading-relaxed text-text/85">
                Refrescaña nació de esa pasión por lo puro y lo natural. Cada producto es
                una obra artesanal, pequeños lotes, mucho cuidado, máxima pureza.
                Conectamos a las familias con la esencia de la naturaleza peruana.
              </Text>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.2}>
              <div className="relative aspect-square rounded-[var(--radius-2xl)] overflow-hidden">
                <ParallaxImage
                  src={interior3.src}
                  alt="Productos naturales"
                  width={interior3.width}
                  height={interior3.height}
                  speed={0.15}
                  className="w-full h-full"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
