import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartSidebar } from '@/components/layout/CartSidebar'
import { PageTransition } from '@/components/layout/PageTransition'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

export function ShopLayout() {
  return (
    <>
      <Navbar />
      <CartSidebar />
      <PageTransition>
        <main>
          <Outlet />
        </main>
      </PageTransition>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
