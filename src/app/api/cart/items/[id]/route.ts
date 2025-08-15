import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// PUT /api/cart/items/[id] - Update cart item quantity
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
    const { quantity } = body
    const itemId = params.id

    if (!quantity || quantity < 1) {
      return NextResponse.json({ 
        error: 'Quantity must be greater than 0' 
      }, { status: 400 })
    }

    // Check if item belongs to user
    const { data: existingItem, error: checkError } = await supabase
      .from('cart_items')
      .select('user_id')
      .eq('id', itemId)
      .single()

    if (checkError || !existingItem) {
      return NextResponse.json({ 
        error: 'Cart item not found' 
      }, { status: 404 })
    }

    if (existingItem.user_id !== user.id) {
      return NextResponse.json({ 
        error: 'Forbidden' 
      }, { status: 403 })
    }

    // Update quantity
    const { data: updatedItem, error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)
      .select(`
        *,
        product:products(*)
      `)
      .single()

    if (updateError) {
      console.error('Error updating cart item:', updateError)
      return NextResponse.json({ 
        error: 'Failed to update cart item' 
      }, { status: 500 })
    }

    return NextResponse.json({
      item: updatedItem,
      message: 'Cart item updated successfully'
    })

  } catch (error) {
    console.error('Error in PUT /api/cart/items/[id]:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error' 
    }, { status: 500 })
  }
}

// DELETE /api/cart/items/[id] - Remove item from cart
export async function DELETE(
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

    const itemId = params.id

    // Check if item belongs to user
    const { data: existingItem, error: checkError } = await supabase
      .from('cart_items')
      .select('user_id')
      .eq('id', itemId)
      .single()

    if (checkError || !existingItem) {
      return NextResponse.json({ 
        error: 'Cart item not found' 
      }, { status: 404 })
    }

    if (existingItem.user_id !== user.id) {
      return NextResponse.json({ 
        error: 'Forbidden' 
      }, { status: 403 })
    }

    // Delete item
    const { error: deleteError } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)

    if (deleteError) {
      console.error('Error deleting cart item:', deleteError)
      return NextResponse.json({ 
        error: 'Failed to remove cart item' 
      }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Cart item removed successfully'
    })

  } catch (error) {
    console.error('Error in DELETE /api/cart/items/[id]:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error' 
    }, { status: 500 })
  }
}
