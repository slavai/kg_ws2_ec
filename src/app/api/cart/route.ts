import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/cart - Get user's cart
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch cart items with product details
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching cart:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch cart' 
      }, { status: 500 })
    }

    return NextResponse.json({
      items: cartItems || []
    })

  } catch (error) {
    console.error('Error in GET /api/cart:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error' 
    }, { status: 500 })
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { product_id, quantity = 1 } = body

    if (!product_id) {
      return NextResponse.json({ 
        error: 'Product ID is required' 
      }, { status: 400 })
    }

    // Check if product exists and is active
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', product_id)
      .eq('is_active', true)
      .single()

    if (productError || !product) {
      return NextResponse.json({ 
        error: 'Product not found or not available' 
      }, { status: 404 })
    }

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', product_id)
      .single()

    let cartItem
    
    if (existingItem) {
      // Update quantity
      const { data: updatedItem, error: updateError } = await supabase
        .from('cart_items')
        .update({ 
          quantity: existingItem.quantity + quantity 
        })
        .eq('id', existingItem.id)
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

      cartItem = updatedItem
    } else {
      // Add new item
      const { data: newItem, error: insertError } = await supabase
        .from('cart_items')
        .insert([{
          user_id: user.id,
          product_id,
          quantity
        }])
        .select(`
          *,
          product:products(*)
        `)
        .single()

      if (insertError) {
        console.error('Error adding to cart:', insertError)
        return NextResponse.json({ 
          error: 'Failed to add to cart' 
        }, { status: 500 })
      }

      cartItem = newItem
    }

    return NextResponse.json({
      item: cartItem,
      message: 'Item added to cart successfully'
    })

  } catch (error) {
    console.error('Error in POST /api/cart:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error' 
    }, { status: 500 })
  }
}

// DELETE /api/cart - Clear entire cart
export async function DELETE() {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete all cart items for user
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)

    if (error) {
      console.error('Error clearing cart:', error)
      return NextResponse.json({ 
        error: 'Failed to clear cart' 
      }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Cart cleared successfully'
    })

  } catch (error) {
    console.error('Error in DELETE /api/cart:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error' 
    }, { status: 500 })
  }
}
