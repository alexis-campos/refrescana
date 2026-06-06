'use client'

import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { ContactoHero, MultiStepForm, CanalesDirectos, MapaInfo } from '@/components/sections/contacto'
import { api } from '@/lib/api/endpoints'

export function ContactoPage() {
  const [products, setProducts] = useState<{ name: string; slug: string }[]>([])

  useEffect(() => {
    api.public.products()
      .then((prods) => setProducts(prods.map((p) => ({ name: p.name, slug: p.slug }))))
      .catch(() => {/* falla silenciosa, MultiStepForm maneja lista vacía */})
  }, [])

  return (
    <>
      <Helmet>
        <title>Contacto — Refrescaña</title>
        <meta name="description" content="Contáctanos para consultas sobre productos, pedidos mayoristas, personalización de packs o asesoría." />
      </Helmet>
      <main>
        <ContactoHero />
        <MultiStepForm products={products} />
        <CanalesDirectos />
        <MapaInfo />
      </main>
    </>
  )
}
