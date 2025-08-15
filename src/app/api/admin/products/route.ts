import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createProduct, getAllProducts } from '@/lib/supabase/products'

// GET /api/admin/products - List all products
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication and admin rights
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userProfile } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!userProfile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search') || undefined

    // Fetch products
    const { products, total } = await getAllProducts({ limit, offset, search })

    return NextResponse.json({
      products,
      total,
      limit,
      offset
    })

  } catch (error) {
    console.error('Error in GET /api/admin/products:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error' 
    }, { status: 500 })
  }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication and admin rights
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userProfile } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!userProfile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Parse and validate request body
    const body = await request.json()
    const { name, description, image_url, price, is_active } = body

    if (!name?.trim()) {
      return NextResponse.json({ 
        error: 'Название продукта обязательно' 
      }, { status: 400 })
    }

    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json({ 
        error: 'Цена должна быть положительным числом' 
      }, { status: 400 })
    }

    // Create product
    const product = await createProduct({
      name: name.trim(),
      description: description?.trim() || undefined,
      image_url: image_url?.trim() || undefined,
      price,
      is_active: is_active ?? true
    })

    return NextResponse.json(product, { status: 201 })

  } catch (error) {
    console.error('Error in POST /api/admin/products:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal Server Error' 
    }, { status: 500 })
  }
}