'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { CartItem as CartItemType } from '@/lib/types/database'
import { useTranslations } from 'next-intl'
import { CyberButton } from '@/components/ui/CyberButton'

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
  const t = useTranslations('Cart')

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
      console.log('Failed to update quantity:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    setIsUpdating(true)
    try {
      await onRemove(item.id)
    } catch (error) {
      console.log('Failed to remove item:', error)
      setIsUpdating(false)
    }
  }

  const itemTotal = product.price * quantity

  return (
    <div className={`cyber-card bg-cyber-dark border border-cyber-medium p-6 hover:border-neon-cyan hover:neon-glow-cyan transition-all duration-300 ${
      isLoading || isUpdating ? 'opacity-50 pointer-events-none' : ''
    }`}>
      <div className="flex items-center space-x-6">
        {/* Product Image */}
        <div className="w-20 h-20 bg-cyber-black border border-neon-cyan rounded-cyber flex items-center justify-center overflow-hidden neon-glow-cyan">
          {product.image_url && !imageError ? (
            <Image
              src={product.image_url}
              alt={product.name}
              width={80}
              height={80}
              className="object-cover w-full h-full"
              onError={() => setImageError(true)}
              unoptimized={product.image_url.includes('unsplash.com')}
            />
          ) : (
            <span className="text-3xl neon-text-cyan glitch">📦</span>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold neon-text-cyan font-cyber uppercase tracking-wider truncate hover:glitch-hover">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-cyber-light font-mono truncate mt-1">
              [{product.description}]
            </p>
          )}
          <p className="text-xl font-bold neon-text-green mt-2 font-cyber">
            ${product.price.toFixed(2)}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1 || isUpdating}
            className="w-10 h-10 bg-cyber-dark border border-neon-pink text-neon-pink flex items-center justify-center disabled:opacity-50 hover:neon-glow-pink hover:bg-neon-pink/10 transition-all duration-300 rounded-cyber font-cyber font-bold hover:glitch"
          >
            <span className="text-xl">−</span>
          </button>
          
          <span className="w-12 text-center font-bold text-neon-cyan font-cyber text-lg bg-cyber-black border border-neon-cyan px-2 py-1 rounded-cyber neon-glow-cyan">
            {quantity}
          </span>
          
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={isUpdating}
            className="w-10 h-10 bg-cyber-dark border border-neon-green text-neon-green flex items-center justify-center hover:neon-glow-green hover:bg-neon-green/10 transition-all duration-300 rounded-cyber font-cyber font-bold hover:glitch"
          >
            <span className="text-xl">+</span>
          </button>
        </div>

        {/* Item Total */}
        <div className="text-right">
          <p className="text-xl font-bold neon-text-cyan font-cyber">
            ${itemTotal.toFixed(2)}
          </p>
          <p className="text-sm text-cyber-light font-mono">
            ${product.price.toFixed(2)} × [{quantity}]
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          disabled={isUpdating}
          className="w-10 h-10 bg-cyber-dark border border-glitch-red text-glitch-red flex items-center justify-center hover:neon-glow-pink hover:bg-glitch-red/20 transition-all duration-300 rounded-cyber hover:glitch"
          title={t('removeFromCart')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}
