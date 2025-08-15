import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// PUT /api/purchased-products/[id] - Update product status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body
    const productId = params.id

    if (!status || !['not_applied', 'applied'].includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status. Must be "not_applied" or "applied"' 
      }, { status: 400 })
    }

    // Check if product belongs to user
    const { data: existingProduct, error: checkError } = await supabase
      .from('purchased_products')
      .select('user_id')
      .eq('id', productId)
      .single()

    if (checkError || !existingProduct) {
      return NextResponse.json({ 
        error: 'Purchased product not found' 
      }, { status: 404 })
    }

    if (existingProduct.user_id !== user.id) {
      return NextResponse.json({ 
        error: 'Forbidden' 
      }, { status: 403 })
    }

    // Update status
    const { data: updatedProduct, error: updateError } = await supabase
      .from('purchased_products')
      .update({ status })
      .eq('id', productId)
      .select('*')
      .single()

    if (updateError) {
      console.error('Error updating product status:', updateError)
      return NextResponse.json({ 
        error: 'Failed to update product status' 
      }, { status: 500 })
    }

    return NextResponse.json({
      product: updatedProduct,
      message: 'Product status updated successfully'
    })

  } catch (error) {
    console.error('Error in PUT /api/purchased-products/[id]:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error' 
    }, { status: 500 })
  }
}
