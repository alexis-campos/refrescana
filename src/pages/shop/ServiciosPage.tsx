import { Helmet } from 'react-helmet-async'
import { ServiciosHero, ServiciosList, ServicioCTA } from '@/components/sections/servicios'

export function ServiciosPage() {
  return (
    <>
      <Helmet>
        <title>Servicios — Refrescaña</title>
        <meta name="description" content="Personalización de packs, suministros mayoristas, degustaciones y más. Descubre nuestros servicios para negocios." />
      </Helmet>
      <ServiciosHero />
      <ServiciosList />
      <ServicioCTA />
    </>
  )
}
