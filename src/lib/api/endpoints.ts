import { http } from './http'
import type {
  AuthUser,
  Category,
  Product,
  Order,
  BlogPost,
  Notification,
  ContactMessage,
  CheckoutCreateInput,
  CheckoutCreateResponse,
  DashboardStats,
} from '@/types/api'

export const api = {
  auth: {
    login: (email: string, password: string) =>
      http.post<AuthUser>('/api/auth/login', { email, password }),
    logout: () =>
      http.post<void>('/api/auth/logout'),
    me: () =>
      http.get<AuthUser>('/api/auth/me'),
  },

  public: {
    homeData: () =>
      http.get<{ featuredProducts: Product[]; categories: Category[] }>('/api/public/home-data'),
    products: (params?: { categoryId?: string }) => {
      const q = params?.categoryId ? `?categoryId=${params.categoryId}` : ''
      return http.get<Product[]>(`/api/public/products${q}`)
    },
    productBySlug: (slug: string) =>
      http.get<Product>(`/api/public/products/${slug}`),
    categories: () =>
      http.get<Category[]>('/api/public/categories'),
    blog: () =>
      http.get<BlogPost[]>('/api/public/blog'),
    blogBySlug: (slug: string) =>
      http.get<BlogPost>(`/api/public/blog/${slug}`),
  },

  checkout: {
    create: (data: CheckoutCreateInput) =>
      http.post<CheckoutCreateResponse>('/api/checkout', data),
    uploadVoucher: (formData: FormData) =>
      http.post<{ message: string }>('/api/checkout/upload-voucher', formData),
    getOrder: (orderId: string, email: string) =>
      http.get<Order>(`/api/checkout/${orderId}?email=${encodeURIComponent(email)}`),
  },

  admin: {
    dashboard: () =>
      http.get<DashboardStats>('/api/admin/dashboard-stats'),

    products: {
      list: (categoryId?: string) => {
        const q = categoryId ? `?categoryId=${categoryId}` : ''
        return http.get<Product[]>(`/api/admin/products${q}`)
      },
      get: (id: string) =>
        http.get<Product>(`/api/admin/products/${id}`),
      create: (data: FormData | Record<string, unknown>) =>
        http.post<Product>('/api/admin/products', data),
      update: (id: string, data: FormData | Record<string, unknown>) =>
        http.put<Product>(`/api/admin/products/${id}`, data),
      delete: (id: string) =>
        http.del<void>(`/api/admin/products/${id}`),
    },

    categories: {
      list: () =>
        http.get<Category[]>('/api/admin/categories'),
      create: (data: { name: string; slug: string; description?: string }) =>
        http.post<Category>('/api/admin/categories', data),
      update: (id: string, data: { name: string; slug: string; description?: string }) =>
        http.put<Category>(`/api/admin/categories/${id}`, data),
      delete: (id: string) =>
        http.del<void>(`/api/admin/categories/${id}`),
    },

    orders: {
      list: () =>
        http.get<Order[]>('/api/admin/orders'),
      get: (id: string) =>
        http.get<Order>(`/api/admin/orders/${id}`),
      updateStatus: (id: string, status: string) =>
        http.patch<Order>(`/api/admin/orders/${id}`, { status }),
      createExternal: (formData: FormData) =>
        fetch('/api/admin/orders', { method: 'POST', credentials: 'include', body: formData })
          .then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.error || 'Error'); return d as Order }),
      cancelExpired: (days = 3) =>
        http.post<{ cancelled: number }>('/api/admin/orders/cancel-expired', { days }),
    },

    blog: {
      list: () =>
        http.get<BlogPost[]>('/api/admin/blog'),
      create: (data: Record<string, unknown>) =>
        http.post<BlogPost>('/api/admin/blog', data),
      update: (id: string, data: Record<string, unknown>) =>
        http.put<BlogPost>(`/api/admin/blog/${id}`, data),
      delete: (id: string) =>
        http.del<void>(`/api/admin/blog/${id}`),
    },

    upload: (formData: FormData) =>
      http.post<{ url: string }>('/api/admin/upload', formData),

    notifications: {
      list: (unread?: boolean) => {
        const q = unread ? '?unread=true' : ''
        return http.get<{ notifications: Notification[]; unreadCount: number }>(`/api/admin/notifications${q}`)
      },
      markRead: (ids?: string[]) =>
        http.patch<void>('/api/admin/notifications', ids ? { ids } : { all: true }),
    },

    exportOrders: () =>
      fetch('/api/admin/export/orders', { credentials: 'include' }),

    contact: {
      list: (unread?: boolean) => {
        const q = unread ? '?unread=true' : ''
        return http.get<{ messages: ContactMessage[]; unreadCount: number }>(`/api/admin/contact${q}`)
      },
      get: (id: string) =>
        http.get<ContactMessage>(`/api/admin/contact/${id}`),
      markRead: (id?: string) =>
        http.patch<void>('/api/admin/contact', id ? { id } : { all: true }),
      delete: (id: string) =>
        http.del<void>(`/api/admin/contact/${id}`),
    },
  },

  contact: {
    send: (data: {
      name: string
      email: string
      phone?: string
      subject?: string
      productInterest?: string
      message: string
    }) => http.post<{ ok: boolean; id: string }>('/api/contact', data),
  },
}
