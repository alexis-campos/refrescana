import { Helmet } from 'react-helmet-async'

export function PrivacidadPage() {
  return (
    <>
      <Helmet>
        <title>Políticas de Privacidad — Refrescaña</title>
      </Helmet>
      <main className="pt-32 pb-24 container max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-[#1C442A] mb-8">Políticas de Privacidad</h1>
        <div className="prose prose-green max-w-none text-gray-700 space-y-6">
          <p>
            En Refrescaña, respetamos tu privacidad y nos comprometemos a proteger los datos personales que nos proporcionas.
          </p>
          <h2 className="text-2xl font-semibold text-[#1C442A] mt-8 mb-4">1. Información que recopilamos</h2>
          <p>
            Recopilamos información cuando realizas un pedido o llenas un formulario. Los datos pueden incluir tu nombre, correo electrónico, dirección postal y número de teléfono.
          </p>
          <h2 className="text-2xl font-semibold text-[#1C442A] mt-8 mb-4">2. Uso de la información</h2>
          <p>
            Cualquier información que recopilemos de ti puede ser utilizada para: personalizar tu experiencia, mejorar nuestro sitio web, mejorar el servicio al cliente y procesar transacciones.
          </p>
          <h2 className="text-2xl font-semibold text-[#1C442A] mt-8 mb-4">3. Protección de tus datos</h2>
          <p>
            Implementamos medidas de seguridad para mantener la seguridad de tu información personal cuando realizas un pedido o accedes a tu información.
          </p>
          <p className="mt-12 text-sm text-gray-500">
            Última actualización: Mayo de 2026
          </p>
        </div>
      </main>
    </>
  )
}
