'use client'

import { useRef } from 'react'
import Image from '@/components/ui/Img'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

import { TextReveal } from '@/components/animations'
import { ScrollReveal } from '@/components/animations'

const heroImg = '/hero/hero-2.jpg'

export function NosotrosHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const shouldReduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ['0px', '80px'])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.35, 0.65])

  return (
    <section ref={sectionRef} className="relative h-screen min-h-[500px] overflow-hidden">
      {/* Background image with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 scale-[1.15]"
          style={{ y: shouldReduce ? '0px' : imageY }}
        >
          <Image
            src={heroImg}
            alt="Equipo Refrescaña — Productos naturales de la selva peruana"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/20 to-primary/60" />

      {/* Scroll-driven darkening */}
      <motion.div
        className="absolute inset-0 bg-primary"
        style={{ opacity: shouldReduce ? 0.35 : overlayOpacity }}
      />

      {/* Content — centered */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[var(--container-px)]">
        {/* Logo */}
        <ScrollReveal variant="fade" delay={0.1} className="mb-8">
          <Image
            src="/logo/logo.webp"
            alt="Refrescaña logo"
            width={240}
            height={100}
            className="object-contain"
          />
        </ScrollReveal>

        <TextReveal
          text="La esencia pura de la selva peruana"
          as="h1"
          className="font-display italic font-light tracking-tight text-bg text-[length:var(--text-hero)] max-w-5xl"
          delay={0.2}
        />

        <motion.p
          className="mt-4 font-serif font-light tracking-[-0.015em] text-[length:var(--text-h3)] text-bg/75"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          De la naturaleza a tu bienestar, detalle a detalle
        </motion.p>
      </div>
    </section>
  )
}
