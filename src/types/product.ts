

export type ProductCategory =
  | 'jarabes'
  | 'aceites'
  | 'harinas'
  | 'vinagres'
  | 'cuidado-personal'
  | 'packs'

export type ProductFilterOption = 'todos' | ProductCategory

export type ProductStatus = 'disponible' | 'agotado' | 'poco-stock'

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  jarabes: 'Jarabes Naturales',
  aceites: 'Aceites Esenciales',
  harinas: 'Harinas',
  vinagres: 'Vinagres',
  'cuidado-personal': 'Cuidado Personal',
  packs: 'Packs',
}

export const PRODUCT_FILTER_OPTIONS: { value: ProductFilterOption; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'jarabes', label: 'Jarabes' },
  { value: 'aceites', label: 'Aceites' },
  { value: 'harinas', label: 'Harinas' },
  { value: 'vinagres', label: 'Vinagres' },
  { value: 'cuidado-personal', label: 'Cuidado Personal' },
  { value: 'packs', label: 'Packs' },
]

export const STATUS_LABELS: Record<ProductStatus, string> = {
  disponible: 'Disponible',
  agotado: 'Agotado',
  'poco-stock': 'Últimas unidades',
}

export interface Product {
  id: number
  name: string
  slug: string
  category: ProductCategory
  price: number
  comparePrice?: number
  description: string
  shortDescription: string
  benefits: string[]
  ingredients: string[]
  usage: string
  presentation: string
  weight: string
  image: string
  gallery?: string[]
  status: ProductStatus
  featured: boolean
  tags: string[]
  rating?: number
  reviewCount?: number
}

export interface ProductPreview {
  id: number
  name: string
  slug: string
  category: ProductCategory
  price: number
  comparePrice?: number
  shortDescription: string
  presentation: string
  image: string
  status: ProductStatus
  featured: boolean
  rating?: number
}
