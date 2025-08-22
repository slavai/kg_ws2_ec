export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url?: string
  category?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}
