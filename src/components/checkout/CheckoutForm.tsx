'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAppDispatch, useCart } from '@/lib/redux/hooks'
import { useAuth } from '@/contexts/AuthContext'
import { processPurchase } from '@/lib/redux/slices/ordersSlice'
import { clearCart } from '@/lib/redux/slices/cartSlice'

export default function CheckoutForm() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { userProfile, refreshProfile } = useAuth()
  const { items, total, itemCount } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({})

  const userBalance = userProfile?.balance || 0
  const hasEnoughBalance = userBalance >= total
  const remainingBalance = userBalance - total

  const handlePurchase = async () => {
    if (!hasEnoughBalance || isProcessing || items.length === 0) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const result = await dispatch(processPurchase()).unwrap()
      
      // Clear cart and refresh user profile
      await dispatch(clearCart())
      await refreshProfile()
      
      // Redirect to order success page
      router.push(`/order/${result.order?.id}`)
    } catch (error: any) {
      setError(error.message || 'Failed to process purchase')
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Your cart is empty
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Add some items to your cart before proceeding to checkout.
        </p>
        <a
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Checkout
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Review your order and complete your purchase
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Order Items ({itemCount})
            </h2>
            
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  {/* Product Image */}
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                    {item.product?.image_url && !imageErrors[item.id] ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name || 'Product'}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                        onError={() => setImageErrors(prev => ({...prev, [item.id]: true}))}
                        unoptimized={item.product.image_url.includes('unsplash.com')}
                      />
                    ) : (
                      <span className="text-xl">📦</span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                      {item.product?.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ${(item.product?.price || 0).toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Payment Summary
            </h2>
            
            {/* Order Total */}
            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Total
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Balance Info */}
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Current Balance
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${userBalance.toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  After Purchase
                </span>
                <span className={`font-medium ${
                  remainingBalance >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  ${remainingBalance.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Balance Warning */}
            {!hasEnoughBalance && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      Insufficient Balance
                    </p>
                    <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                      You need ${(total - userBalance).toFixed(2)} more to complete this purchase.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Purchase Button */}
            <button
              onClick={handlePurchase}
              disabled={!hasEnoughBalance || isProcessing}
              className={`w-full mt-6 py-3 px-4 rounded-lg font-medium transition-colors ${
                hasEnoughBalance && !isProcessing
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Purchase...
                </span>
              ) : hasEnoughBalance ? (
                `Complete Purchase ($${total.toFixed(2)})`
              ) : (
                'Insufficient Balance'
              )}
            </button>

            {/* Back to Cart */}
            <div className="mt-4 text-center">
              <a 
                href="/cart"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                ← Back to Cart
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
