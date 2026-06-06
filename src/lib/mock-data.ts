// Image paths from public/ directory
const heroImg2 = '/vistas/home/insta-1.jpg'
const heroImg3 = '/vistas/home/insta-2.jpg'
const heroImg4 = '/vistas/home/insta-3.jpg'
const heroImg5 = '/vistas/home/insta-4.jpg'
const heroImg6 = '/vistas/home/insta-5.jpg'

// Team photos
const team1 = '/team/team-1.webp'
const team2 = '/team/team-2.webp'
const team3 = '/team/team-3.webp'

import type { Testimonial } from '@/types/testimonial'    
import type { Service } from '@/types/service'

// ─── Servicios ────────────────────────────────────────────────────────────────

export const MOCK_SERVICES: Service[] = [
  {
    id: 1,
    title: 'Personalización de Packs',
    slug: 'personalizacion-packs',
    description: 'Combinamos los mejores productos de nuestra marca en packs diseñados a medida para minimarkets y puntos de venta.',
    longDescription: 'La unión estratégica de productos de la marca para los principales minimarkets. Por ejemplo, el aceite de coco con el aceite esencial de orégano que incluye los beneficios de ambos productos para su consumo y receta de cómo consumirlo.',
    icon: 'package',
    features: [
      'Combinaciones personalizadas de productos',
      'Material informativo con beneficios incluido',
      'Recetas y guías de uso',
      'Packaging especial para punto de venta',
    ],
  },
  {
    id: 2,
    title: 'Suministros Mayoristas',
    slug: 'suministros-mayoristas',
    description: 'Provisión de insumos naturales en línea blanca o con marca propia para minimarkets, locales y empresas privadas.',
    longDescription: 'Servicio de provisión de insumos naturales en línea blanca o con marca propia para los diferentes puntos de venta. Incluye aceite esencial de muña, jarabes naturales, vinagres y harinas con la posibilidad de personalizar la marca.',
    icon: 'truck',
    features: [
      'Precios especiales por volumen',
      'Opción de marca blanca',
      'Entrega programada y recurrente',
      'Catálogo completo de insumos',
    ],
  },
  {
    id: 3,
    title: 'Degustaciones',
    slug: 'degustaciones',
    description: 'Catas de jarabes naturales a base de miel de caña en los minimarkets y locales donde se proveen los productos.',
    longDescription: 'Organizamos eventos de degustación y catas de nuestros jarabes naturales a base de miel de caña en los minimarkets y locales donde se proveen los productos, generando conexión directa con el consumidor final.',
    icon: 'wine',
    features: [
      'Eventos presenciales en punto de venta',
      'Material promocional incluido',
      'Personal capacitado para atención',
      'Muestras y recetarios para clientes',
    ],
  },
  {
    id: 4,
    title: 'Venta Asistida Digital',
    slug: 'venta-asistida-digital',
    description: 'Asesoramiento personalizado vía WhatsApp para ayudar al cliente a elegir el producto ideal según su necesidad.',
    longDescription: 'Asesoramiento personalizado vía WhatsApp para ayudar al cliente a elegir el producto ideal según su necesidad de salud o belleza. Nuestro equipo está capacitado para orientar sobre los beneficios y usos de cada producto.',
    icon: 'message',
    features: [
      'Atención personalizada por WhatsApp',
      'Guía de productos según necesidad',
      'Seguimiento post-venta',
      'Envío de catálogos digitales interactivos',
    ],
  },
  {
    id: 5,
    title: 'Soporte Logístico',
    slug: 'soporte-logistico',
    description: 'Acompañamiento y capacitación para emprendedores que deseen revender los productos de la empresa.',
    longDescription: 'Servicio de acompañamiento y capacitación para el emprendedor que desee revender los productos de la empresa o participar en la venta de productos en ferias especializadas. Incluye material de marketing y soporte operativo.',
    icon: 'headset',
    features: [
      'Capacitación para revendedores',
      'Material de marketing y ventas',
      'Soporte en ferias y eventos',
      'Asesoría en punto de venta',
    ],
  },
]

// ─── Testimonios ──────────────────────────────────────────────────────────────

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    quote:
      'Desde que descubrí el jarabe de miel de caña de Refrescaña, mi familia y yo dejamos el azúcar refinada por completo. La calidad se siente desde el primer sabor, es increíble saber que viene directamente de la selva peruana.',
    clientName: 'Alexis Campos Palomino',
    clientPhoto: team1,
    productName: 'Jarabe de Miel de Caña',
    type: 'photo',
    featured: true,
  }
]

// ─── Hero images ──────────────────────────────────────────────────────────────
export { heroImg2, heroImg3, heroImg4, heroImg5, heroImg6 }
export { team1, team2, team3 }
