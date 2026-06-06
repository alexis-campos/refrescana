'use client'

import Image from '@/components/ui/Img'
import { ScrollReveal, ParallaxImage } from '@/components/animations'
import { Heading, Text } from '@/components/ui'
import { cn } from '@/lib/utils'

interface Property {
  label: string
  title: string
  description: string
  image: { src: string; width: number; height: number }
  imageAlt: string
  reverse: boolean
}

const PROPERTIES: Property[] = [
  {
    label: '01',
    title: 'Referentes en la Selva Peruana',
    description:
      'Nuestro primer objetivo es lograr que la marca sea reconocida como el referente número uno de productos naturales de la selva peruana en las ferias y mercados especializados. Trabajamos para llevar la riqueza natural del Perú a cada rincón del país.',
    image: { src: '/vistas/nosotros/objetivos-1.jpg', width: 1920, height: 1280 },
    imageAlt: 'Productos naturales de la selva peruana',
    reverse: false,
  },
  {
    label: '02',
    title: 'Presencia Digital y Visibilidad',
    description:
      'Incrementar la visibilidad de la marca en redes sociales y página web, utilizando catálogos digitales interactivos y campañas de marketing de contenidos sobre los beneficios de nuestros productos naturales.',
    image: { src: '/vistas/nosotros/objetivos-2.jpg', width: 1920, height: 1280 },
    imageAlt: 'Marketing digital de productos naturales',
    reverse: true,
  },
  {
    label: '03',
    title: 'Pureza y Calidad Artesanal',
    description:
      'Garantizamos la pureza de cada producto — jarabes naturales, aceites esenciales, harinas y derivados — diseñados para mejorar el bienestar integral de las familias. Sin aditivos, sin conservantes, solo la esencia de la naturaleza.',
    image: { src: '/vistas/nosotros/objetivos-3.jpg', width: 1920, height: 1280 },
    imageAlt: 'Calidad artesanal de Refrescaña',
    reverse: false,
  },
]

export function PropiedadesMarca() {
  return (
    <section className="py-[var(--section)] bg-bg overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-[var(--container-px)] mb-[var(--section)]">
        <ScrollReveal>
          <Heading level={2}>Nuestros Objetivos</Heading>
          <Text className="mt-4 text-text/70 max-w-md">
            Tres metas que guían cada paso de Refrescaña hacia la excelencia natural.
          </Text>
        </ScrollReveal>
      </div>

      <div className="space-y-[var(--section)]">
        {PROPERTIES.map((prop) => (
          <div
            key={prop.label}
            className="max-w-[1280px] mx-auto px-[var(--container-px)]"
          >
            <div
              className={cn(
                'grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center',
              )}
            >
              {/* Text */}
              <ScrollReveal
                direction={prop.reverse ? 'left' : 'right'}
                className={cn(prop.reverse ? 'lg:order-2' : 'lg:order-1')}
              >
                <span className="font-body text-xs uppercase tracking-wider text-accent/60 mb-4 block">
                  {prop.label}
                </span>
                <Heading level={3} className="mb-6 max-w-sm">
                  {prop.title}
                </Heading>
                <Text className="text-text/75 leading-relaxed max-w-md">
                  {prop.description}
                </Text>
              </ScrollReveal>

              {/* Image */}
              <ScrollReveal
                direction={prop.reverse ? 'right' : 'left'}
                delay={0.15}
                className={cn(
                  'relative aspect-[4/3] rounded-[var(--radius-2xl)] overflow-hidden',
                  prop.reverse ? 'lg:order-1' : 'lg:order-2',
                )}
              >
                <ParallaxImage
                  src={prop.image.src}
                  alt={prop.imageAlt}
                  width={prop.image.width}
                  height={prop.image.height}
                  speed={0.2}
                  className="w-full h-full"
                />
              </ScrollReveal>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
