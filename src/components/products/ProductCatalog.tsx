'use client'

import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import type { Product } from '@/lib/types/database'

interface ProductCatalogProps {
  initialProducts?: Product[]
}

export default function ProductCatalog({ initialProducts = [] }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState(initialProducts.length === 0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialProducts.length === 0) {
      fetchProducts()
    }
  }, [initialProducts.length])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data.products || [])
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <CatalogSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Failed to load products
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchProducts}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No products available
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Check back later for new digital products!
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Featured Products
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Discover our latest digital products and exclusive offers
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

function CatalogSkeleton() {
  return (
    <div>
      <div className="text-center mb-12">
        <div className="h-8 w-64 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mx-auto mb-4"></div>
        <div className="h-6 w-96 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
            <div className="p-6">
              <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="flex items-center justify-between">
                <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-9 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

