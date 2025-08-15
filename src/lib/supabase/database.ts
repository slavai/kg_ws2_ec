import { createClient } from './server'
import type { User, Product, CartItem, Order, PurchasedProduct } from '@/lib/types/database'

// Database utility functions

export async function getUser(userId: string): Promise<User | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching user:', error)
    return null
  }
  
  return data
}

export async function getProducts(options?: {
  limit?: number
  offset?: number
  activeOnly?: boolean
}): Promise<Product[]> {
  const supabase = await createClient()
  
  let query = supabase.from('products').select('*')
  
  if (options?.activeOnly !== false) {
    query = query.eq('is_active', true)
  }
  
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }
  
  query = query.order('created_at', { ascending: false })
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching products:', error)
    return []
  }
  
  return data || []
}

export async function getUserCart(userId: string): Promise<CartItem[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      product:products(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching cart:', error)
    return []
  }
  
  return data || []
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }
  
  return data || []
}

export async function getUserPurchasedProducts(userId: string): Promise<PurchasedProduct[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('purchased_products')
    .select('*')
    .eq('user_id', userId)
    .order('purchased_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching purchased products:', error)
    return []
  }
  
  return data || []
}

// Test connection is now done via getProducts() in test-db page