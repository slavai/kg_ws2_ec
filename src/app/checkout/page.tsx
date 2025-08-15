'use client'

import { useRequireAuth } from '@/hooks/useAuthGuard'
import CheckoutForm from '@/components/checkout/CheckoutForm'

export default function CheckoutPage() {
  const { isAuthenticated, isLoading } = useRequireAuth('/checkout')

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CheckoutForm />
    </div>
  )
}
