import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/purchased-products - Get user's purchased products
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get('orderId')

    // Build query
    let query = supabase
      .from('purchased_products')
      .select('*')
      .eq('user_id', user.id)

    // Filter by order if specified
    if (orderId) {
      query = query.eq('order_id', orderId)
    }

    // Fetch user's purchased products
    const { data: products, error } = await query.order('purchased_at', { ascending: false })

    if (error) {
      console.error('Error fetching purchased products:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch purchased products' 
      }, { status: 500 })
    }

    return NextResponse.json({
      products: products || []
    })

  } catch (error) {
    console.error('Error in GET /api/purchased-products:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error' 
    }, { status: 500 })
  }
}
