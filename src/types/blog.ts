

export type BlogCategory = 'bienestar' | 'recetas' | 'beneficios' | 'novedades'

export type BlogFilterOption = 'todos' | BlogCategory

export const CATEGORY_LABELS: Record<BlogCategory, string> = {
  bienestar: 'Bienestar',
  recetas: 'Recetas',
  beneficios: 'Beneficios',
  novedades: 'Novedades',
}

export const BLOG_FILTER_OPTIONS: { value: BlogFilterOption; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'bienestar', label: 'Bienestar' },
  { value: 'recetas', label: 'Recetas' },
  { value: 'beneficios', label: 'Beneficios' },
  { value: 'novedades', label: 'Novedades' },
]

export interface BlogPost {
  id: string | number
  title: string
  slug: string
  excerpt: string
  category: BlogCategory
  author: string
  publishedAt: string
  readingTime: string
  image: string
  featured: boolean
  content: string
  tags: string[]
}
