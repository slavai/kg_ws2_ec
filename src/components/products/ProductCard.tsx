'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useAppDispatch } from '@/lib/redux/hooks'
import { addToCart } from '@/lib/redux/slices/cartSlice'
import type { Product } from '@/lib/types/database'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleAddToCart = async () => {
    if (!user || isAdding) return

    setIsAdding(true)
    try {
      await dispatch(addToCart({ productId: product.id })).unwrap()
      
      // Show success feedback
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error: any) {
      console.error('Failed to add to cart:', error)
      // Could add error toast here
    } finally {
      setIsAdding(false)
    }
  }

  const handleAuthRequired = () => {
    // Trigger auth modal or redirect to login
    // For now, just scroll to top where auth modal can be triggered
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
        {product.image_url && !imageError ? (
          <Image
            src={product.image_url}
            alt={product.name}
            width={192}
            height={192}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            unoptimized={product.image_url.includes('unsplash.com')}
          />
        ) : (
          <div className="text-6xl">📦</div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
            ${product.price.toFixed(2)}
          </span>
          
          {user ? (
            <button
              onClick={handleAddToCart}
              disabled={isAdding || !product.is_active}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                showSuccess
                  ? 'bg-green-600 text-white'
                  : product.is_active
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md transform hover:scale-105'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              } ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isAdding ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </span>
              ) : showSuccess ? (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Added!
                </span>
              ) : product.is_active ? (
                'Add to Cart'
              ) : (
                'Unavailable'
              )}
            </button>
          ) : (
            <button
              onClick={handleAuthRequired}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Login to Buy
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
