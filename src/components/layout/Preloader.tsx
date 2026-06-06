'use client'

import { useEffect, useRef, useState } from 'react'
import Image from '@/components/ui/Img'
import gsap from 'gsap'
import { usePreloader } from './PreloaderContext'

const STORAGE_KEY = 'refrescana-preloader-shown'

export function Preloader() {
  const [shouldShow, setShouldShow] = useState(false)
  const { onPreloaderDone } = usePreloader()

  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const panelTopRef = useRef<HTMLDivElement>(null)
  const panelBottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const alreadyShown = sessionStorage.getItem(STORAGE_KEY)
    if (!alreadyShown && !prefersReducedMotion) {
      sessionStorage.setItem(STORAGE_KEY, 'true')
      document.body.style.overflow = 'hidden'
      setShouldShow(true)
    } else {
      onPreloaderDone()
    }
  }, [onPreloaderDone])

  useEffect(() => {
    if (!shouldShow) return
    const container = containerRef.current
    const logo = logoRef.current
    const line = lineRef.current
    const tagline = taglineRef.current
    const panelTop = panelTopRef.current
    const panelBottom = panelBottomRef.current
    if (!container || !logo || !line || !tagline || !panelTop || !panelBottom) return

    gsap.set(logo, { opacity: 0, y: 28, scale: 0.97 })
    gsap.set(line, { scaleX: 0, transformOrigin: 'center center' })
    gsap.set(tagline, { opacity: 0, y: 10 })

    const tl = gsap.timeline({
      onComplete: () => {
        container.style.display = 'none'
        container.style.pointerEvents = 'none'
        document.body.style.overflow = ''
      },
    })

    tl.to(logo, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 })
      .to(line, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, '-=0.35')
      .to(tagline, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
      .to([logo, line, tagline], { opacity: 0, y: -12, duration: 0.4, ease: 'power2.in', stagger: 0.05, delay: 0.7 })
      .call(() => { onPreloaderDone() })
      .to(panelTop, { yPercent: -100, duration: 0.6, ease: 'power2.inOut' }, '-=0.05')
      .to(panelBottom, { yPercent: 100, duration: 0.6, ease: 'power2.inOut' }, '<')

    return () => { tl.kill(); document.body.style.overflow = '' }
  }, [shouldShow, onPreloaderDone])

  if (!shouldShow) return null

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9998]" aria-hidden="true">
      <div ref={panelTopRef} className="absolute inset-x-0 top-0 h-1/2 bg-bg" />
      <div ref={panelBottomRef} className="absolute inset-x-0 bottom-0 h-1/2 bg-bg" />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <div ref={logoRef}>
          <Image
            src="/logo/logo.webp"
            alt="Refrescaña"
            width={280}
            height={120}
            className="object-contain"
            priority
          />
        </div>
        <div ref={lineRef} className="mt-5 mb-4 h-px bg-accent/40" style={{ width: 'clamp(56px,7vw,88px)' }} />
        <p ref={taglineRef} className="font-serif font-normal text-text-muted tracking-[-0.015em]" style={{ fontSize: 'clamp(0.75rem, 1.1vw, 0.9375rem)' }}>
          De la naturaleza peruana a tu bienestar
        </p>
      </div>
    </div>
  )
}
