

export interface Testimonial {
  id: number
  quote: string
  clientName: string
  clientPhoto?: string
  productName?: string
  type: 'text' | 'photo' | 'video'
  videoUrl?: string
  featured: boolean
}
