import { createClient } from './server'
import type { Product } from '@/lib/types/database'

export interface CreateProductData {
  name: string
  description?: string
  image_url?: string
  price: number
  is_active?: boolean
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string
}

// Create a new product
export async function createProduct(data: CreateProductData): Promise<Product | null> {
  const supabase = await createClient()
  
  const { data: product, error } = await supabase
    .from('products')
    .insert([{
      name: data.name,
      description: data.description || null,
      image_url: data.image_url || null,
      price: data.price,
      is_active: data.is_active ?? true
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creating product:', error)
    throw new Error(error.message)
  }

  return product
}

// Update an existing product
export async function updateProduct(data: UpdateProductData): Promise<Product | null> {
  const supabase = await createClient()
  
  const updateData: Partial<CreateProductData> = {}
  if (data.name !== undefined) updateData.name = data.name
  if (data.description !== undefined) updateData.description = data.description
  if (data.image_url !== undefined) updateData.image_url = data.image_url
  if (data.price !== undefined) updateData.price = data.price
  if (data.is_active !== undefined) updateData.is_active = data.is_active

  // Always update the timestamp
  updateData.updated_at = new Date().toISOString()

  const { data: product, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', data.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating product:', error)
    throw new Error(error.message)
  }

  return product
}

// Delete a product
export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting product:', error)
    throw new Error(error.message)
  }

  return true
}

// Get a single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient()
  
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return product
}

// Get all products for admin (including inactive)
export async function getAllProducts(options?: {
  limit?: number
  offset?: number
  search?: string
}): Promise<{ products: Product[], total: number }> {
  const supabase = await createClient()
  
  let query = supabase.from('products').select('*', { count: 'exact' })
  
  // Search by name
  if (options?.search) {
    query = query.ilike('name', `%${options.search}%`)
  }
  
  // Pagination
  if (options?.limit) {
    const start = options.offset || 0
    const end = start + options.limit - 1
    query = query.range(start, end)
  }
  
  // Order by creation date (newest first)
  query = query.order('created_at', { ascending: false })
  
  const { data: products, error, count } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return { products: [], total: 0 }
  }

  return { 
    products: products || [], 
    total: count || 0 
  }
}

// Toggle product active status
export async function toggleProductStatus(id: string, isActive: boolean): Promise<Product | null> {
  return updateProduct({ id, is_active: isActive })
}