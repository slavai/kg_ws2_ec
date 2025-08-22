'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRequireAuth } from '@/hooks/useAuthGuard'
import CartList from '@/components/cart/CartList'

export default function CartPage() {
  const { isAuthenticated, isLoading } = useRequireAuth('/cart')

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CartList />
    </div>
  )
}

