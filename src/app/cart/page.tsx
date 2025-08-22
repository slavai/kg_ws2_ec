'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRequireAuth } from '@/hooks/useAuthGuard'
import CartList from '@/components/cart/CartList'

export default function CartPage() {
  const { isAuthenticated, isLoading } = useRequireAuth('/cart')

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-cyber-black crt-screen scanlines flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin neon-glow-cyan"></div>
          <div className="text-neon-cyan font-cyber text-lg uppercase tracking-wider neon-text-cyan">
            [ACCESSING_CART.SYS]
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cyber-black crt-screen scanlines">
      <CartList />
    </div>
  )
}

