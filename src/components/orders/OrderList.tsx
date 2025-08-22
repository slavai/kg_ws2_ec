'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useAppDispatch, useOrdersList, useOrdersLoading } from '@/lib/redux/hooks'
import { fetchOrders } from '@/lib/redux/slices/ordersSlice'

export default function OrderList() {
  const dispatch = useAppDispatch()
  const orders = useOrdersList()
  const loading = useOrdersLoading()

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  if (loading && orders.length === 0) {
    return <OrdersSkeleton />
  }

  if (!loading && orders.length === 0) {
    return <EmptyOrders />
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Order History
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track and manage your past purchases
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Order #{order.id.slice(-8)}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <span className="inline-flex px-3 py-1 text-sm font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-full">
                  {order.status}
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ${order.total_amount.toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/order/${order.id}`}
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Details
              </Link>
              <Link
                href="/my-products"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                View Products
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OrdersSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-64 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>

      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="h-9 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-9 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyOrders() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No orders yet
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          You haven't made any purchases yet. Start exploring our products!
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Start Shopping
        </Link>
      </div>
    </div>
  )
}

