'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, usePurchasedProducts, useOrdersLoading } from '@/lib/redux/hooks'
import { fetchPurchasedProducts, updateProductStatus } from '@/lib/redux/slices/ordersSlice'

export default function PurchasedProductList() {
  const dispatch = useAppDispatch()
  const products = usePurchasedProducts()
  const loading = useOrdersLoading()
  const [filter, setFilter] = useState<'all' | 'not_applied' | 'applied'>('all')

  useEffect(() => {
    dispatch(fetchPurchasedProducts())
  }, [dispatch])

  const handleStatusUpdate = async (productId: string, status: 'not_applied' | 'applied') => {
    await dispatch(updateProductStatus({ productId, status }))
  }

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      // Could add a toast notification here
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true
    return product.status === filter
  })

  if (loading && products.length === 0) {
    return <ProductsSkeleton />
  }

  if (!loading && products.length === 0) {
    return <EmptyProducts />
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Digital Products
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your purchased digital products and activation codes
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'all', name: 'All Products', count: products.length },
              { id: 'not_applied', name: 'Not Applied', count: products.filter(p => p.status === 'not_applied').length },
              { id: 'applied', name: 'Applied', count: products.filter(p => p.status === 'applied').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as typeof filter)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  filter === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {tab.name}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  filter === tab.id
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            No products found for the selected filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onStatusUpdate={handleStatusUpdate}
              onCopyCode={handleCopyCode}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface ProductCardProps {
  product: {
    id: string
    product_name: string
    price: number
    product_code: string
    status: 'not_applied' | 'applied'
    purchased_at: string
  }
  onStatusUpdate: (productId: string, status: 'not_applied' | 'applied') => Promise<void>
  onCopyCode: (code: string) => Promise<void>
}

function ProductCard({ product, onStatusUpdate, onCopyCode }: ProductCardProps) {
  const [showCode, setShowCode] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async () => {
    setIsUpdating(true)
    try {
      const newStatus = product.status === 'not_applied' ? 'applied' : 'not_applied'
      await onStatusUpdate(product.id, newStatus)
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCopy = async () => {
    await onCopyCode(product.product_code)
    // Could add visual feedback here
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {product.product_name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Purchased on {new Date(product.purchased_at).toLocaleDateString()}
          </p>
          <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">
            ${product.price.toFixed(2)}
          </p>
        </div>
        
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          product.status === 'applied'
            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
            : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
        }`}>
          {product.status === 'applied' ? 'Applied' : 'Not Applied'}
        </span>
      </div>

      {/* Product Code */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Product Code:
          </span>
          <button
            onClick={() => setShowCode(!showCode)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            {showCode ? 'Hide' : 'Reveal'}
          </button>
        </div>
        
        {showCode ? (
          <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
            <div className="flex justify-between items-center mb-1">
              <code className="font-mono text-sm text-gray-900 dark:text-white">
                {product.product_code}
              </code>
              <button
                onClick={handleCopy}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline ml-2"
              >
                Copy
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={handleStatusChange}
          disabled={isUpdating}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            product.status === 'not_applied'
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUpdating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-current" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </span>
          ) : product.status === 'not_applied' ? (
            'Mark as Applied'
          ) : (
            'Mark as Not Applied'
          )}
        </button>
      </div>
    </div>
  )
}

function ProductsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="h-8 w-56 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-80 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="h-5 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
            <div className="h-9 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyProducts() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💎</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No digital products yet
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          You haven't purchased any digital products yet. Start exploring our catalog!
        </p>
        <a
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Browse Products
        </a>
      </div>
    </div>
  )
}

