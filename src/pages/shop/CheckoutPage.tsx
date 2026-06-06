import { Helmet } from 'react-helmet-async'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'

export function CheckoutPage() {
  return (
    <>
      <Helmet>
        <title>Checkout — Refrescaña</title>
      </Helmet>
      <div className="container py-12">
        <CheckoutForm />
      </div>
    </>
  )
}
