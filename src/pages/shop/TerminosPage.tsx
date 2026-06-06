import { Helmet } from 'react-helmet-async'

export function TerminosPage() {
  return (
    <>
      <Helmet>
        <title>Términos y Condiciones — Refrescaña</title>
      </Helmet>
      <main className="pt-32 pb-24 container max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-[#1C442A] mb-8">Términos y Condiciones</h1>
        <div className="prose prose-green max-w-none text-gray-700 space-y-6">
          <p>
            Bienvenido a Refrescaña. Estos términos y condiciones describen las reglas y regulaciones para el uso de nuestro sitio web y servicios.
          </p>
          <h2 className="text-2xl font-semibold text-[#1C442A] mt-8 mb-4">1. Aceptación de los Términos</h2>
          <p>
            Al acceder a este sitio web, asumimos que aceptas estos términos y condiciones. No continúes usando Refrescaña si no estás de acuerdo con todos los términos y condiciones establecidos en esta página.
          </p>
          <h2 className="text-2xl font-semibold text-[#1C442A] mt-8 mb-4">2. Uso del Sitio</h2>
          <p>
            No debes republicar material de Refrescaña, vender, alquilar o sublicenciar material de Refrescaña, reproducir, duplicar o copiar material, ni redistribuir contenido de Refrescaña.
          </p>
          <h2 className="text-2xl font-semibold text-[#1C442A] mt-8 mb-4">3. Compras y Envíos</h2>
          <p>
            Nos esforzamos por garantizar la disponibilidad de nuestros productos, pero los niveles de inventario pueden variar. Los plazos de envío proporcionados son estimaciones.
          </p>
          <p className="mt-12 text-sm text-gray-500">
            Última actualización: Mayo de 2026
          </p>
        </div>
      </main>
    </>
  )
}
