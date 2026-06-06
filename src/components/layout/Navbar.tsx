'use client'

import { useState, useRef, useEffect } from 'react'
import Link from '@/components/ui/NavLink'
import Image from '@/components/ui/Img'
import { useLocation } from 'react-router-dom'
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion'
import { cn } from '@/lib/utils'
import { CONTACT } from '@/lib/constants'
import { useCartStore } from '@/lib/store/useCartStore'

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Productos', href: '/productos' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contacto', href: '/contacto' },
] as const

/** Pages with dark-image heroes where top-of-page navbar links should be light. */
const DARK_HERO_ROOTS = ['/nosotros', '/productos', '/servicios', '/blog', '/contacto']

function hasDarkHero(pathname: string): boolean {
  if (pathname === '/') return true
  return DARK_HERO_ROOTS.some(root => pathname === root)
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { pathname } = useLocation()
  const headerRef = useRef<HTMLElement>(null)
  
  const { items, openCart } = useCartStore()
  const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0)
  
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest >= 50)
    // Keep --navbar-height in sync on every scroll frame (tracks padding animation in real-time)
    const el = headerRef.current
    if (el) {
      document.documentElement.style.setProperty('--navbar-height', `${el.getBoundingClientRect().height}px`)
    }
  })

  // Set --navbar-height on mount and after each transition completes
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const update = () => {
      document.documentElement.style.setProperty('--navbar-height', `${el.getBoundingClientRect().height}px`)
    }
    update()
    // Re-read after the 300ms Framer Motion animation finishes
    const t = setTimeout(update, 350)
    return () => clearTimeout(t)
  }, [isScrolled])

  const closeMobile = () => setMobileOpen(false)

  // True when links should be light (dark-image hero + not yet scrolled)
  const isDarkHeroTop = !isScrolled && hasDarkHero(pathname)

  return (
    <>
      <motion.header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-[100]"
        animate={{
          paddingTop: isScrolled ? '0.75rem' : '1.5rem',
          paddingBottom: isScrolled ? '0.75rem' : '1.5rem',
          backgroundColor: isScrolled
            ? 'rgba(245, 245, 242, 0.95)'
            : 'rgba(245, 245, 242, 0)',
          backdropFilter: isScrolled ? 'blur(12px)' : 'blur(0px)',
          boxShadow: isScrolled
            ? '0 4px 20px rgba(0, 0, 0, 0.05)'
            : '0 0 0 transparent',
        }}
        transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
      >
        <div className="container flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10 flex-shrink-0">
            <motion.div
              animate={{ width: isScrolled ? 110 : 150, height: isScrolled ? 40 : 54 }}
              transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
              className="relative"
            >
              <Image
                src="/logo/logo.webp"
                alt="Refrescaña"
                fill
                sizes="150px"
                className={cn(
                  'object-contain transition-all duration-300',
                  isDarkHeroTop ? 'brightness-[10] invert-0' : ''
                )}
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                href={link.href}
                active={pathname === link.href}
                isDarkHeroTop={isDarkHeroTop}
              >
                {link.label}
              </NavLink>
            ))}

            {/* Cart icon */}
            <button 
              onClick={openCart}
              className="relative cursor-pointer hover:text-accent transition-colors"
              aria-label="Abrir Carrito"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn('transition-colors duration-300', isDarkHeroTop ? 'text-bg' : 'text-text')}>
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            className={cn(
              'lg:hidden relative z-10 p-2 -mr-2 transition-colors duration-300',
              isDarkHeroTop ? 'text-bg' : 'text-text'
            )}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <div className="flex flex-col gap-[5px]">
              <motion.span
                className="block h-px w-6 bg-current rounded-full"
                animate={
                  mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.span
                className="block h-px w-6 bg-current rounded-full"
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-px w-6 bg-current rounded-full"
                animate={
                  mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-[30] bg-bg lg:hidden flex flex-col overflow-y-auto"
          >
            {/* Spacer for header height */}
            <div className="h-20 flex-shrink-0" />

            <div className="flex flex-col justify-between flex-1 px-[var(--container-px)] pb-10">
              {/* Nav links */}
              <nav className="flex flex-col pt-8">
                {NAV_LINKS.map((link, index) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMobile}
                      className={`block py-3 font-display font-bold tracking-tight text-[clamp(1.75rem,5vw,2.5rem)] transition-colors duration-200 border-b border-[var(--color-border)] ${
                        pathname === link.href
                          ? 'text-accent'
                          : 'text-text hover:text-accent'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Bottom: contact info + RRSS */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.4,
                  delay: NAV_LINKS.length * 0.06 + 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-10 pt-8 border-t border-[var(--color-border)] flex flex-col gap-4"
              >
                <a
                  href={`tel:+51${CONTACT.phones[0]}`}
                  className="font-body text-text-muted hover:text-accent transition-colors duration-150"
                >
                  +51 {CONTACT.phones[0]}
                </a>
                <div className="flex items-center gap-6">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm text-text-muted hover:text-accent transition-colors duration-150"
                  >
                    Instagram
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm text-text-muted hover:text-accent transition-colors duration-150"
                  >
                    Facebook
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── NavLink ─────────────────────────────────────────────────────────────────

interface NavLinkProps {
  href: string
  active: boolean
  children: React.ReactNode
  hasChevron?: boolean
  chevronOpen?: boolean
  isDarkHeroTop?: boolean
}

function NavLink({
  href,
  active,
  children,
  hasChevron = false,
  chevronOpen = false,
  isDarkHeroTop = false,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'relative inline-flex items-center gap-1 font-body text-sm tracking-normal group transition-colors duration-300',
        active
          ? 'text-accent'
          : isDarkHeroTop
            ? 'text-bg/90 hover:text-bg'
            : 'text-text hover:text-accent'
      )}
    >
      {children}

      {hasChevron && (
        <motion.svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: chevronOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden
        >
          <path d="M2 3.5l3 3 3-3" />
        </motion.svg>
      )}

      {/* Underline */}
      <span
        className={cn(
          'absolute -bottom-0.5 left-0 h-px transition-all duration-300 ease-in-out',
          active ? 'w-full' : 'w-0 group-hover:w-full',
          isDarkHeroTop && !active ? 'bg-bg' : 'bg-accent'
        )}
      />
    </Link>
  )
}
