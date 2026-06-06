'use client'

import React, { useRef, useEffect } from 'react'
import Image from '@/components/ui/Img'
import { useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollReveal } from '@/components/animations'
import { Heading, SubHeading, Text } from '@/components/ui'
import { cn } from '@/lib/utils'
import { usePreloader } from '@/components/layout/PreloaderContext'

interface ProcessStep {
  number: string
  title: string
  description: React.ReactNode
  image: string
  imageAlt: string
}

const STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Extracción y Recepción (Materia Prima)',
    description: (
      <>
        Es el punto de partida donde se obtienen los recursos naturales. El valor añadido comienza desde la selección, asegurando que la materia prima sea de calidad.
        <br />
        <br />
        <strong>Ejemplo:</strong> Cosechar de la chacra la planta silvestre (sachawira) o recolectar caña de azúcar.
        <br />
        <strong>Valor añadido inicial:</strong> Clasificación y limpieza profunda.
      </>
    ),
    image: '/vistas/nosotros/proceso-1.jpg',
    imageAlt: 'Extracción y Recepción',
  },
  {
    number: '02',
    title: 'Procesamiento Primario',
    description: (
      <>
        La materia prima (caña de azúcar) se somete a la extracción del jugo con el uso del Trapiche.
        <br />
        <br />
        <strong>Técnicas comunes:</strong> Molienda, filtrado, destilación, fermentación y deshidratación.
      </>
    ),
    image: '/vistas/nosotros/proceso-2.jpg',
    imageAlt: 'Procesamiento Primario',
  },
  {
    number: '03',
    title: 'Formulación y Refinamiento (El "Toque Especial")',
    description: (
      <>
        En esta etapa se combinan diferentes elementos para crear una mezcla única.
        <br />
        <br />
        <strong>Mezcla:</strong> Combinar varios extractos para potenciar un beneficio (como un jarabe natural).
        <br />
        <strong>Estandarización:</strong> Asegurar que cada lote tenga el mismo sabor, aroma o efectividad.
        <br />
        <strong>Conservación:</strong> Aplicar métodos que alarguen la vida útil del producto sin sacrificar su esencia.
      </>
    ),
    image: '/vistas/nosotros/proceso-3.jpg',
    imageAlt: 'Formulación y Refinamiento',
  },
  {
    number: '04',
    title: 'Empaque, Branding y Certificación',
    description: (
      <>
        Un producto bien presentado comunica confianza. En el diseño de las etiquetas se usa colores llamativos e información clara. Envase funcional en presentación de vidrio (300ml, 100ml, 500ml, 750ml).
        <br />
        <br />
        Contamos con registro sanitario:
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Miel de caña de azúcar - N6950922N</li>
          <li>Aceite de coco - C1304421N</li>
          <li>Harina de cúrcuma, kion y pimienta negra - M4151525N</li>
          <li>Vinagre de manzana - M6600226N</li>
        </ul>
      </>
    ),
    image: '/vistas/nosotros/proceso-4.jpg',
    imageAlt: 'Empaque y Certificación',
  },
  {
    number: '05',
    title: 'Distribución y Comercialización',
    description: (
      <>
        Los productos se encuentran en los principales minimarket de Tingo María, se participa también en ferias y congresos donde se hace conocer el producto y la empresa. Se hacen envíos nacionales con las agencias terrestres.
      </>
    ),
    image: '/vistas/nosotros/proceso-5.jpg',
    imageAlt: 'Distribución y Comercialización',
  },
]

export function NuestroProceso() {
  const shouldReduce = useReducedMotion()
  const { isPreloaderDone } = usePreloader()

  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const textRefs = useRef<(HTMLDivElement | null)[]>([])
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (shouldReduce || !isPreloaderDone) return

    gsap.registerPlugin(ScrollTrigger)

    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      const pin = pinRef.current
      const track = trackRef.current
      const line = lineRef.current
      if (!pin || !track || !line) return

      const rafId = requestAnimationFrame(() => {
        const scrollDistance = track.scrollHeight - pin.clientHeight

        gsap.set(line, { scaleY: 0, transformOrigin: 'top center' })

        // Steps 1–3 start hidden; step 0 is visible immediately
        for (let i = 1; i < STEPS.length; i++) {
          const isOdd = i % 2 === 0
          const textEl = textRefs.current[i]
          const imgEl = imageRefs.current[i]
          const nodeEl = nodeRefs.current[i]
          if (textEl) gsap.set(textEl, { opacity: 0, x: isOdd ? 60 : -60 })
          if (imgEl) gsap.set(imgEl, { opacity: 0, x: isOdd ? -60 : 60 })
          if (nodeEl) gsap.set(nodeEl, { opacity: 0, scale: 0 })
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            pin: true,
            start: 'top top',
            end: `+=${scrollDistance}`,
            scrub: 1,
            pinSpacing: true,
          },
        })

        // Track movement and line growth span the full timeline duration (4)
        tl.to(track, { y: -scrollDistance, ease: 'none', duration: 4 }, 0)
        tl.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: 'none', duration: 4 }, 0)

        // Each step animates in just before its panel centers in the viewport.
        const stepTriggers = [0.6, 1.6, 2.6, 3.6]

        for (let i = 1; i < STEPS.length; i++) {
          const pos = stepTriggers[i - 1]
          const textEl = textRefs.current[i]
          const imgEl = imageRefs.current[i]
          const nodeEl = nodeRefs.current[i]

          if (nodeEl) {
            tl.to(nodeEl, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.4)' }, pos)
          }
          if (textEl) {
            tl.to(textEl, { opacity: 1, x: 0, duration: 0.35, ease: 'expo.out' }, pos)
          }
          if (imgEl) {
            tl.to(
              imgEl,
              { opacity: 1, x: 0, duration: 0.35, ease: 'expo.out' },
              pos + 0.04,
            )
          }
        }

        ScrollTrigger.refresh()
      })

      return () => cancelAnimationFrame(rafId)
    })

    return () => mm.revert()
  }, [shouldReduce, isPreloaderDone])

  return (
    <section className="bg-surface">
      {/* Section header — scrolls normally on both mobile and desktop */}
      <div className="pt-[var(--section)] px-[var(--container-px)]">
        <div className="max-w-[1280px] mx-auto">
          <ScrollReveal className="mb-[var(--section-sm)]">
            <Heading level={2} className="mb-4">
              Nuestro Proceso
            </Heading>
            <Text className="text-text-muted max-w-lg">
              De la selva a tu mesa — cinco pasos, un mismo compromiso con la pureza.
            </Text>
          </ScrollReveal>
        </div>
      </div>

      {/* ── Desktop: pinned scroll timeline ─────────────────────────────── */}
      <div
        ref={pinRef}
        className="hidden lg:block h-screen overflow-hidden relative"
      >
        {/* Progress line — fixed in the viewport, grows with scroll */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px z-10 pointer-events-none">
          <div className="absolute inset-0 bg-accent/20" />
          <div ref={lineRef} className="absolute inset-0 bg-accent/60" />
        </div>

        {/* Track — 500vh tall; translated upward by GSAP */}
        <div ref={trackRef} className="h-[500vh]">
          {STEPS.map((step, index) => {
            const isOdd = index % 2 === 0

            return (
              <div
                key={step.number}
                className="h-screen flex items-center px-[var(--container-px)]"
              >
                <div className="max-w-[1280px] mx-auto w-full grid grid-cols-2 gap-16 items-center relative">
                  {/* Node dot — centered on the timeline line */}
                  <div
                    ref={el => {
                      nodeRefs.current[index] = el
                    }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                  >
                    <div className="w-10 h-10 rounded-full bg-bg border-2 border-accent flex items-center justify-center shadow-[var(--shadow-sm)]">
                      <span className="font-body text-xs text-accent font-medium">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Text */}
                  <div
                    ref={el => {
                      textRefs.current[index] = el
                    }}
                    className={cn('px-12', !isOdd && 'order-2')}
                  >
                    <SubHeading as="h3" className="mb-4">
                      {step.title}
                    </SubHeading>
                    <div className="text-text-muted leading-relaxed">
                      {step.description}
                    </div>
                  </div>

                  {/* Image */}
                  <div
                    ref={el => {
                      imageRefs.current[index] = el
                    }}
                    className={cn(
                      'relative aspect-[4/3] rounded-[var(--radius-xl)] overflow-hidden',
                      !isOdd && 'order-1',
                    )}
                  >
                    <Image
                      src={step.image}
                      alt={step.imageAlt}
                      fill
                      sizes="50vw"
                      className="object-cover"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Mobile: regular vertical layout ─────────────────────────────── */}
      <div className="lg:hidden px-[var(--container-px)] pb-[var(--section)]">
        <div className="max-w-[1280px] mx-auto space-y-[var(--section-sm)]">
          {STEPS.map(step => (
            <div key={step.number}>
              <ScrollReveal direction="up">
                <span className="font-body text-xs uppercase tracking-wider text-accent/60 mb-3 block">
                  {step.number}
                </span>
                <SubHeading as="h3" className="mb-4">
                  {step.title}
                </SubHeading>
                <div className="text-text-muted leading-relaxed">
                  {step.description}
                </div>
              </ScrollReveal>
              <ScrollReveal
                direction="up"
                delay={0.15}
                className="relative aspect-[4/3] rounded-[var(--radius-xl)] overflow-hidden mt-6"
              >
                <Image
                  src={step.image}
                  alt={step.imageAlt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
