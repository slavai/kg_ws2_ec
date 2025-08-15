'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { CartItem as CartItemType } from '@/lib/types/database'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>
  onRemove: (itemId: string) => Promise<void>
  isLoading?: boolean
}

export default function CartItem({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  isLoading = false 
}: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity)
  const [isUpdating, setIsUpdating] = useState(false)
  const [imageError, setImageError] = useState(false)

  const product = item.product
  
  if (!product) {
    return null
  }

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return
    
    setIsUpdating(true)
    try {
      await onUpdateQuantity(item.id, newQuantity)
      setQuantity(newQuantity)
    } catch (error) {
      console.error('Failed to update quantity:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    setIsUpdating(true)
    try {
      await onRemove(item.id)
    } catch (error) {
      console.error('Failed to remove item:', error)
      setIsUpdating(false)
    }
  }

  const itemTotal = product.price * quantity

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 ${
      isLoading || isUpdating ? 'opacity-50 pointer-events-none' : ''
    }`}>
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
          {product.image_url && !imageError ? (
            <Image
              src={product.image_url}
              alt={product.name}
              width={64}
              height={64}
              className="object-cover w-full h-full"
              onError={() => setImageError(true)}
              unoptimized={product.image_url.includes('unsplash.com')}
            />
          ) : (
            <span className="text-2xl">📦</span>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {product.description}
            </p>
          )}
          <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-1">
            ${product.price.toFixed(2)}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1 || isUpdating}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <span className="text-lg font-medium">−</span>
          </button>
          
          <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
            {quantity}
          </span>
          
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={isUpdating}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <span className="text-lg font-medium">+</span>
          </button>
        </div>

        {/* Item Total */}
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            ${itemTotal.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            ${product.price.toFixed(2)} × {quantity}
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          disabled={isUpdating}
          className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          title="Remove from cart"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}
