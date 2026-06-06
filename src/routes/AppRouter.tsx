import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ShopLayout } from './ShopLayout'
import { ProtectedRoute } from './ProtectedRoute'
import AdminLayout from '@/components/admin/AdminLayout'

// Shop pages
import { HomePage } from '@/pages/shop/HomePage'
import { NosotrosPage } from '@/pages/shop/NosotrosPage'
import { ProductosPage } from '@/pages/shop/ProductosPage'
import { ProductoDetallePage } from '@/pages/shop/ProductoDetallePage'
import { ServiciosPage } from '@/pages/shop/ServiciosPage'
import { BlogPage } from '@/pages/shop/BlogPage'
import { BlogDetallePage } from '@/pages/shop/BlogDetallePage'
import { ContactoPage } from '@/pages/shop/ContactoPage'
import { CheckoutPage } from '@/pages/shop/CheckoutPage'
import { TerminosPage } from '@/pages/shop/TerminosPage'
import { PrivacidadPage } from '@/pages/shop/PrivacidadPage'
import { NotFoundPage } from '@/pages/shop/NotFoundPage'

// Admin pages
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage'
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage'
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage'
import { AdminOrderDetailPage } from '@/pages/admin/AdminOrderDetailPage'
import { AdminBlogPage } from '@/pages/admin/AdminBlogPage'
import { AdminMessagesPage } from '@/pages/admin/AdminMessagesPage'

export const router = createBrowserRouter([
  {
    element: <ShopLayout />,
    children: [
      { path: '/',                element: <HomePage /> },
      { path: '/nosotros',        element: <NosotrosPage /> },
      { path: '/productos',       element: <ProductosPage /> },
      { path: '/productos/:slug', element: <ProductoDetallePage /> },
      { path: '/servicios',       element: <ServiciosPage /> },
      { path: '/blog',            element: <BlogPage /> },
      { path: '/blog/:slug',      element: <BlogDetallePage /> },
      { path: '/contacto',        element: <ContactoPage /> },
      { path: '/checkout',        element: <CheckoutPage /> },
      { path: '/terminos',        element: <TerminosPage /> },
      { path: '/privacidad',      element: <PrivacidadPage /> },
    ],
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,              element: <AdminDashboardPage /> },
      { path: 'products',         element: <AdminProductsPage /> },
      { path: 'categories',       element: <AdminCategoriesPage /> },
      { path: 'orders',           element: <AdminOrdersPage /> },
      { path: 'orders/:id',       element: <AdminOrderDetailPage /> },
      { path: 'blog',             element: <AdminBlogPage /> },
      { path: 'messages',         element: <AdminMessagesPage /> },
      { path: '*',                element: <Navigate to="/admin" replace /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
