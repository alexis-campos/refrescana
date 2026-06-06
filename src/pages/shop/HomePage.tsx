import { Helmet } from 'react-helmet-async'
import { HeroSection } from '@/components/sections/home/HeroSection'
import { IntroSection } from '@/components/sections/home/IntroSection'
import { ProductosDestacados } from '@/components/sections/home/ProductosDestacados'
import { ProcesoSection } from '@/components/sections/home/ProcesoSection'
import { ServiciosBanner } from '@/components/sections/home/ServiciosBanner'
import { MisionVision } from '@/components/sections/home/MisionVision'
import { TestimonioDestacado } from '@/components/sections/home/TestimonioDestacado'
import { PropuestaDeValor } from '@/components/sections/home/PropuestaDeValor'
import { InstagramFeed } from '@/components/sections/home/InstagramFeed'
import { PuntosDeVenta } from '@/components/sections/home/PuntosDeVenta'
import { CTAFinal } from '@/components/sections/home/CTAFinal'

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Refrescaña — Productos Naturales de la Selva Peruana</title>
        <meta name="description" content="Productos naturales artesanales de alta pureza: jarabes, aceites esenciales, harinas y derivados de la caña. Bienestar, nutrición y cuidado personal." />
      </Helmet>
      <HeroSection />
      <IntroSection />
      <ProductosDestacados />
      <ProcesoSection />
      <ServiciosBanner />
      <MisionVision />
      <TestimonioDestacado />
      <PropuestaDeValor />
      <PuntosDeVenta />
      <InstagramFeed />
      <CTAFinal />
    </>
  )
}
