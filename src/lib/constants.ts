export const SITE_NAME = 'Refrescaña'
export const SITE_URL = 'https://refrescana.pe'
export const SITE_DESCRIPTION = 'Productos naturales de la selva peruana para tu bienestar.'
export const SITE_LEGAL_NAME = 'Princesa Inka Nature SAC'
export const SITE_RUC = '20613282620'

export const CONTACT = {
  phones: ['943501918'],
  email: 'refrescana.com@gmail.com',
  whatsapp: '943501918',
} as const

export const NAV_LINKS = [
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/productos', label: 'Productos' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/blog', label: 'Blog' },
  { href: '/contacto', label: 'Contacto' },
] as const

export const ANIMATION_DEFAULTS = {
  entrance: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
  stagger: {
    staggerChildren: 0.1,
    delayChildren: 0.1,
  },
  hover: {
    scale: 1.02,
    y: -8,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  },
  tap: {
    scale: 0.97,
  },
  spring: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },
} as const

// ================= YAPE PAYMENT CONFIG =================
export const YAPE_CONFIG = {
  phone: '986 854 899',
  holderName: 'Princesa Inka Nature SAC',
  qrImage: '/yape-qr.png',
} as const

// ================= SHIPPING ZONES =================
export interface ShippingZone {
  label: string
  cost: number
}

export const SHIPPING_ZONES: Record<string, ShippingZone> = {
  'huanuco': { label: 'Huánuco (Ciudad)', cost: 5.00 },
  'huanuco-provincia': { label: 'Huánuco (Provincia)', cost: 10.00 },
  'lima': { label: 'Lima Metropolitana', cost: 15.00 },
  'lima-provincia': { label: 'Lima (Provincia)', cost: 18.00 },
  'costa-norte': { label: 'Costa Norte (Trujillo, Chiclayo, Piura)', cost: 20.00 },
  'costa-sur': { label: 'Costa Sur (Ica, Arequipa, Tacna)', cost: 20.00 },
  'sierra': { label: 'Sierra (Cusco, Ayacucho, Junín, etc.)', cost: 18.00 },
  'selva': { label: 'Selva (Pucallpa, Iquitos, Tarapoto)', cost: 22.00 },
} as const

export const FREE_SHIPPING_MIN = 150.00 // Envío gratis desde S/150

