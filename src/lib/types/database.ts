export interface User {
  id: string
  email: string
  full_name?: string
  balance: number
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description?: string
  image_url?: string
  price: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  // Joined fields from product
  product?: Product
}

export interface Order {
  id: string
  user_id: string
  total_amount: number
  status: string
  created_at: string
}

export interface PurchasedProduct {
  id: string
  order_id: string
  user_id: string
  product_id: string
  product_name: string
  price: number
  product_code: string
  status: 'not_applied' | 'applied'
  purchased_at: string
}

// Utility types for API responses
export type ApiResponse<T> = {
  data: T | null
  error: string | null
}

export type PaginatedResponse<T> = {
  data: T[]
  count: number
  page: number
  limit: number
}