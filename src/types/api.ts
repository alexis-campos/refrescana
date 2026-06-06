export type Role = 'ADMIN' | 'EDITOR' | 'SALES' | 'CUSTOMER'

export type OrderStatus =
  | 'PENDING'
  | 'PAYMENT_UPLOADED'
  | 'PAID'
  | 'PREPARING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REJECTED'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

export interface ProductImage {
  id: string
  url: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  stock: number
  isActive: boolean
  categoryId: string
  category?: Category
  images?: ProductImage[]
  createdAt?: string
  updatedAt?: string
}

export interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    image: string
    categoryName: string
    price: number
    images?: ProductImage[]
  }
}

export type OrderSource =
  | 'WHATSAPP'
  | 'FACEBOOK'
  | 'INSTAGRAM'
  | 'TELEFONO'
  | 'PRESENCIAL'
  | 'OTRO'

export interface Order {
  id: string
  receiptNumber: string | null
  status: OrderStatus
  source?: OrderSource | null
  customerName: string
  customerEmail: string
  customerPhone: string
  customerDni: string | null
  shippingAddress: string
  shippingCity: string
  shippingProvince: string
  shippingDistrict: string | null
  shippingNotes: string | null
  shippingCost: number
  totalAmount: number
  yapeVoucherUrl: string | null
  yapeSecurityCode: string | null
  yapePaymentTime: string | null
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  imageUrl: string | null
  published: boolean
  createdAt: string
  updatedAt?: string
}

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  orderId?: string | null
  isRead: boolean
  createdAt: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  productInterest: string | null
  message: string
  isRead: boolean
  createdAt: string
}

export interface CheckoutCreateInput {
  customerName: string
  customerEmail: string
  customerPhone: string
  customerDni?: string
  shippingAddress: string
  shippingCity: string
  shippingProvince: string
  shippingZone: string
  shippingNotes?: string
  shippingCost: number
  items: { id: string; quantity: number }[]
}

export interface CheckoutCreateResponse {
  orderId: string
  receiptNumber: string
  totalAmount: number
  shippingCost: number
}

export interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  uniqueClients: number
  monthlyRevenue: { month: string; revenue: number }[]
  topCategories: { name: string; count: number }[]
  recentOrders: Order[]
}
