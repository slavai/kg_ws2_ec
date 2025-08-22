'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useRequireAuth } from '@/hooks/useAuthGuard'

interface Order {
  id: string
  user_id: string
  total_amount: number
  status: string
  created_at: string
}

interface PurchasedProduct {
  id: string
  product_name: string
  price: number
  product_code: string
  status: 'not_applied' | 'applied'
}

export default function OrderPage() {
  const params = useParams()
  const orderId = params.id as string
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth()
  
  const [order, setOrder] = useState<Order | null>(null)
  const [products, setProducts] = useState<PurchasedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated || !orderId) return

    const fetchOrderDetails = async () => {
      try {
        // Fetch order details
        const orderResponse = await fetch(`/api/orders/${orderId}`)
        if (!orderResponse.ok) {
          throw new Error('Failed to fetch order')
        }
        const orderData = await orderResponse.json()
        setOrder(orderData.order)

        // Fetch purchased products for this order
        const productsResponse = await fetch(`/api/purchased-products?orderId=${orderId}`)
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          setProducts(productsData.products || [])
        }
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [isAuthenticated, orderId])

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-8"></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Order Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {error || 'The order you are looking for does not exist or you do not have permission to view it.'}
          </p>
          <Link
            href="/orders"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            Purchase Successful!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your order has been processed and your digital products are ready.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Order Summary
          </h2>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
              <p className="font-mono text-gray-900 dark:text-white">{order.id}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Order Date:</span>
              <p className="text-gray-900 dark:text-white">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
              <p className="font-semibold text-gray-900 dark:text-white">
                ${order.total_amount.toFixed(2)}
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-full">
                {order.status}
              </span>
            </div>
          </div>
        </div>

        {/* Purchased Products */}
        {products.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Your Digital Products
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Your product codes are ready! You can also find them in your <Link href="/my-products" className="text-blue-600 dark:text-blue-400 hover:underline">My Products</Link> section.
            </p>
            
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {product.product_name}
                    </h3>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Product Code:</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(product.product_code)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Copy
                      </button>
                    </div>
                    <code className="block mt-1 font-mono text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded px-2 py-1 border">
                      {product.product_code}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/my-products"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Manage My Products
          </Link>
          <Link
            href="/orders"
            className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors text-center"
          >
            View Order History
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

