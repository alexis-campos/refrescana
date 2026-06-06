import { Helmet } from 'react-helmet-async'
import { NosotrosHero } from '@/components/sections/nosotros'
import { NuestraHistoria } from '@/components/sections/nosotros'
import { GoldenCircle } from '@/components/sections/nosotros'
import { PropiedadesMarca } from '@/components/sections/nosotros'
import { NuestroProceso } from '@/components/sections/nosotros'
import { CTAProyectos } from '@/components/sections/nosotros'

export function NosotrosPage() {
  return (
    <>
      <Helmet>
        <title>Nosotros — Refrescaña</title>
        <meta name="description" content="Conoce la historia y misión de Refrescaña, marca peruana de productos naturales artesanales de la selva." />
      </Helmet>
      <NosotrosHero />
      <NuestraHistoria />
      <GoldenCircle />
      <PropiedadesMarca />
      <NuestroProceso />
      <CTAProyectos />
    </>
  )
}
