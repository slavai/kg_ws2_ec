'use client'

import { useEffect } from 'react'
import CartItem from './CartItem'
import CartSummary from './CartSummary'
import { useAppDispatch, useCart } from '@/lib/redux/hooks'
import { useAuth } from '@/contexts/AuthContext'
import { fetchCart, updateCartItem, removeFromCart, clearCart } from '@/lib/redux/slices/cartSlice'
import { useTranslations } from 'next-intl'
import { CyberButton } from '@/components/ui/CyberButton'
import Link from 'next/link'

export default function CartList() {
  const dispatch = useAppDispatch()
  const { userProfile } = useAuth()
  const { items, total, itemCount, loading, error } = useCart()
  const t = useTranslations('Cart')

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    await dispatch(updateCartItem({ itemId, quantity }))
  }

  const handleRemoveItem = async (itemId: string) => {
    await dispatch(removeFromCart(itemId))
  }

  const handleClearCart = async () => {
    if (window.confirm(t('clearCartConfirm'))) {
      await dispatch(clearCart())
    }
  }

  if (loading && items.length === 0) {
    return <CartSkeleton />
  }

  if (!loading && items.length === 0) {
    return <EmptyCart />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold neon-text-cyan font-cyber glitch-text uppercase tracking-wider">
          {t('title')}
        </h1>
        <p className="text-cyber-light mt-2 font-mono text-lg">
          [{itemCount}] {itemCount === 1 ? t('itemInCart') : t('itemsInCart')}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-cyber-dark border border-glitch-red rounded-cyber neon-glow-pink">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-glitch-red mr-2 pulse-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-glitch-red font-cyber">[ERROR]: {error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {/* Clear Cart Button */}
          {items.length > 0 && (
            <div className="mb-4 flex justify-end">
              <CyberButton
                variant="outline"
                color="pink"
                size="sm"
                onClick={handleClearCart}
                disabled={loading}
                className="hover:glitch"
              >
                {t('clearCart')}
              </CyberButton>
            </div>
          )}

          {/* Items List */}
          <div className="space-y-6">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
                isLoading={loading}
              />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <CartSummary
              total={total}
              itemCount={itemCount}
              userBalance={userProfile?.balance || 0}
              isLoading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function CartSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="h-10 w-64 bg-cyber-dark border border-neon-cyan rounded-cyber pulse-soft mb-2 neon-glow-cyan"></div>
        <div className="h-6 w-32 bg-cyber-dark border border-cyber-medium rounded-cyber pulse-soft"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="cyber-card bg-cyber-dark border border-cyber-medium p-6 neon-glow-cyan">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-cyber-medium border border-neon-cyan rounded-cyber pulse-soft neon-glow-cyan"></div>
                <div className="flex-1">
                  <div className="h-6 w-48 bg-cyber-medium border border-neon-cyan rounded-cyber pulse-soft mb-2"></div>
                  <div className="h-4 w-32 bg-cyber-medium border border-cyber-light rounded-cyber pulse-soft"></div>
                </div>
                <div className="w-24 h-8 bg-cyber-medium border border-neon-purple rounded-cyber pulse-soft"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <div className="cyber-card bg-cyber-dark border border-cyber-medium p-6 neon-glow-purple">
            <div className="h-6 w-32 bg-cyber-medium border border-neon-purple rounded-cyber pulse-soft mb-4"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-20 bg-cyber-medium border border-cyber-light rounded-cyber pulse-soft"></div>
                  <div className="h-4 w-16 bg-cyber-medium border border-cyber-light rounded-cyber pulse-soft"></div>
                </div>
              ))}
            </div>
            <div className="h-12 w-full bg-cyber-medium border border-neon-cyan rounded-cyber pulse-soft mt-6 neon-glow-cyan"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyCart() {
  const t = useTranslations('Cart')
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center py-12 cyber-card bg-cyber-dark border border-cyber-medium neon-glow-cyan">
        <div className="text-8xl mb-6 neon-text-cyan glitch-text">🛒</div>
        <h1 className="text-3xl font-bold neon-text-cyan font-cyber uppercase tracking-wider mb-4 glitch-hover">
          {t('emptyCartTitle')}
        </h1>
        <p className="text-cyber-light mb-8 font-mono text-lg max-w-md mx-auto">
          [{t('emptyCartMessage')}]
        </p>
        <Link href="/">
          <CyberButton 
            variant="neon" 
            color="cyan" 
            size="lg"
            className="hover:glitch"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('continueShoppingButton')}
          </CyberButton>
        </Link>
      </div>
    </div>
  )
}

