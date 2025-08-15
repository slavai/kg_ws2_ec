import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/products - Get active products for public catalog
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search') || undefined

    // Build query for active products only
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true) // Only show active products

    // Search by name if provided
    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    // Apply pagination
    if (limit > 0) {
      const start = offset
      const end = start + limit - 1
      query = query.range(start, end)
    }

    // Order by creation date (newest first)
    query = query.order('created_at', { ascending: false })

    const { data: products, error, count } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch products' 
      }, { status: 500 })
    }

    return NextResponse.json({
      products: products || [],
      total: count || products?.length || 0,
      limit,
      offset
    })

  } catch (error) {
    console.error('Error in GET /api/products:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error' 
    }, { status: 500 })
  }
}
