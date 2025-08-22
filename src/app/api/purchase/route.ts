import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/purchase - Process purchase from cart
export async function POST() {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's cart items
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', user.id)

    if (cartError) {
      console.error('Error fetching cart:', cartError)
      return NextResponse.json({ 
        error: 'Failed to fetch cart' 
      }, { status: 500 })
    }

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ 
        error: 'Cart is empty' 
      }, { status: 400 })
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((total, item) => {
      const price = item.product?.price || 0
      return total + (price * item.quantity)
    }, 0)

    // Get user's current balance
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('balance')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile) {
      console.error('Error fetching user profile:', profileError)
      return NextResponse.json({ 
        error: 'Failed to fetch user profile' 
      }, { status: 500 })
    }

    // Check if user has enough balance
    if (userProfile.balance < totalAmount) {
      return NextResponse.json({ 
        error: 'Insufficient balance',
        required: totalAmount,
        available: userProfile.balance
      }, { status: 400 })
    }

    // Use Supabase function to process purchase
    const { data: purchaseResult, error: purchaseError } = await supabase
      .rpc('process_purchase', { p_user_id: user.id })

    if (purchaseError) {
      console.error('Error processing purchase:', purchaseError)
      return NextResponse.json({ 
        error: purchaseError.message || 'Failed to process purchase' 
      }, { status: 500 })
    }

    // Fetch the created order
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (orderError) {
      console.error('Error fetching new order:', orderError)
    }

    return NextResponse.json({
      order: newOrder,
      message: 'Purchase processed successfully'
    })

  } catch (error) {
    console.error('Error in POST /api/purchase:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error' 
    }, { status: 500 })
  }
}

