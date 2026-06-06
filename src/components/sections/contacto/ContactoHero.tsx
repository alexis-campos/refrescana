'use client'

import { useRef } from 'react'
import Image from '@/components/ui/Img'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { TextReveal } from '@/components/animations'
import { ScrollReveal } from '@/components/animations'

const heroBg = '/hero/hero-5.jpg'

export function ContactoHero() {
  const containerRef = useRef<HTMLElement>(null)
  const shouldReduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0px', '80px'])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.35, 0.65])

  return (
    <section
      ref={containerRef}
      className="relative flex items-center justify-center overflow-hidden h-screen"
    >
      {/* Background image with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 scale-[1.15]"
          style={{ y: shouldReduce ? '0px' : bgY }}
          aria-hidden
        >
          <Image
            src={heroBg}
            alt=""
            fill
            className="object-cover"
            style={{ filter: 'saturate(0.95) brightness(1.02) contrast(1.01)' }}
            priority
            sizes="100vw"
          />
        </motion.div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-dark/40 via-green-dark/20 to-green-dark/60" aria-hidden />

      {/* Scroll-driven darkening */}
      <motion.div
        className="absolute inset-0 bg-primary"
        style={{ opacity: shouldReduce ? 0.35 : overlayOpacity }}
        aria-hidden
      />

      {/* Content — centered */}
      <div className="relative z-10 flex flex-col items-center text-center px-[var(--container-px)]">
        {/* Logo */}
        <ScrollReveal variant="fade" delay={0.1} className="mb-8">
          <Image
            src="/logo/logo.webp"
            alt="Refrescaña logo"
            width={240}
            height={100}
            className="object-contain opacity-85"
          />
        </ScrollReveal>

        <TextReveal
          text="Hablemos"
          as="h1"
          className="font-display italic font-light text-[length:var(--text-hero)] text-bg tracking-tight mb-6"
        />
        <ScrollReveal delay={0.4} variant="fade">
          <p className="font-serif font-light text-[length:var(--text-h3)] text-bg/75 tracking-[-0.015em] max-w-xl mx-auto">
            Estamos listos para ayudarte a encontrar los productos naturales ideales para ti
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
