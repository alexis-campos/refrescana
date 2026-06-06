import Link from '@/components/ui/NavLink'
import Image from '@/components/ui/Img'
import { CONTACT, SITE_LEGAL_NAME, SITE_RUC } from '@/lib/constants'

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Productos', href: '/productos' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contacto', href: '/contacto' },
]

export function Footer() {
  return (
    <footer className="bg-primary text-bg">
      <div className="container py-[var(--section-sm)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div className="flex flex-col gap-4">
            <Image
              src="/logo/logo.webp"
              alt="Refrescaña"
              width={80}
              height={80}
              className="object-contain brightness-[10]"
            />
            <p className="font-body text-sm text-bg/60 tracking-wide uppercase">
              De la naturaleza a tu bienestar
            </p>
            <p className="font-body text-sm text-bg/45 leading-relaxed max-w-[260px] mt-1">
              Productos naturales artesanales de alta pureza de la selva peruana.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-serif font-medium text-bg/50 text-xs tracking-widest uppercase mb-1">Navegación</h3>
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="font-body text-sm text-bg/65 hover:text-bg transition-colors duration-150">{link.label}</Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-serif font-medium text-bg/50 text-xs tracking-widest uppercase mb-1">Contacto</h3>
            {CONTACT.phones.map((phone) => (
              <a key={phone} href={`tel:+51${phone}`} className="font-body text-sm text-bg/65 hover:text-bg transition-colors duration-150">+51 {phone}</a>
            ))}
            <a href={`mailto:${CONTACT.email}`} className="font-body text-sm text-bg/65 hover:text-bg transition-colors duration-150">{CONTACT.email}</a>
            <div className="mt-2 pt-2 border-t border-bg/10">
              <p className="font-body text-xs text-bg/40 leading-relaxed">{SITE_LEGAL_NAME}</p>
              <p className="font-body text-xs text-bg/35">RUC: {SITE_RUC}</p>
              <p className="font-body text-xs text-bg/35">Sector: Agroindustrial</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-serif font-medium text-bg/50 text-xs tracking-widest uppercase mb-1">Síguenos</h3>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/refrescana_pe" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-bg/65 hover:text-bg transition-colors duration-150">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" /></svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61560760616214" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-bg/65 hover:text-bg transition-colors duration-150">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="https://www.tiktok.com/@princesainkasac" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-bg/65 hover:text-bg transition-colors duration-150">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-bg/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="font-body text-xs text-bg/35">© 2026 Refrescaña — {SITE_LEGAL_NAME}. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="/privacidad" className="font-body text-xs text-bg/35 hover:text-bg/65 transition-colors duration-150">Política de privacidad</Link>
            <Link href="/terminos" className="font-body text-xs text-bg/35 hover:text-bg/65 transition-colors duration-150">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
