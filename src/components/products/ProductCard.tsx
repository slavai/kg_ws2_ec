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
    <div className="cyber-card group hover:shadow-lg hover:shadow-neon-cyan/50 transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
      {/* Glitch overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Product Image */}
      <div className="h-48 bg-cyber-black border-b border-cyber-medium flex items-center justify-center overflow-hidden relative">
        {product.image_url && !imageError ? (
          <Image
            src={product.image_url}
            alt={product.name}
            width={192}
            height={192}
            className="object-cover w-full h-full group-hover:scale-110 transition-all duration-500 filter group-hover:brightness-110 group-hover:contrast-125"
            onError={() => setImageError(true)}
            unoptimized={product.image_url.includes('unsplash.com')}
          />
        ) : (
          <div className="text-6xl transform group-hover:glitch text-neon-cyan">📦</div>
        )}
        
        {/* Digital overlay scanlines */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Product Info */}
      <div className="p-6 relative z-10">
        <h3 className="text-lg font-cyber font-bold text-neon-cyan mb-2 group-hover:neon-text-cyan transition-all duration-300 uppercase tracking-wide">
          [{product.name}]
        </h3>
        
        {product.description && (
          <p className="text-cyber-lighter font-mono text-xs mb-4 line-clamp-2 leading-relaxed">
            &gt; {product.description.toUpperCase()}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold font-mono neon-text-pink">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs text-cyber-lighter font-mono">
              CREDITS_REQUIRED
            </span>
          </div>
          
          {user ? (
            <button
              onClick={handleAddToCart}
              disabled={isAdding || !product.is_active}
              className={`px-4 py-2 font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 transform relative overflow-hidden ${
                showSuccess
                  ? 'bg-neon-green text-cyber-black neon-glow-cyan'
                  : product.is_active
                  ? 'bg-cyber-dark border border-neon-cyan text-neon-cyan hover:shadow-lg hover:shadow-neon-cyan/50 hover:bg-neon-cyan/10 hover:scale-105'
                  : 'bg-cyber-medium text-cyber-lighter cursor-not-allowed border border-cyber-medium'
              } ${isAdding ? 'opacity-50 cursor-not-allowed animate-pulse' : ''}`}
              style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)' }}
            >
              {isAdding ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  PROC...
                </span>
              ) : showSuccess ? (
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  ADDED
                </span>
              ) : product.is_active ? (
                'ADD_CART'
              ) : (
                'N/A'
              )}
              
              {/* Button glow effect */}
              {product.is_active && !isAdding && (
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink opacity-0 hover:opacity-20 transition-opacity duration-300" />
              )}
            </button>
          ) : (
            <button
              onClick={handleAuthRequired}
              className="px-4 py-2 bg-cyber-dark border border-glitch-red text-glitch-red font-mono font-bold text-xs uppercase tracking-wider hover:neon-glow-pink hover:bg-glitch-red/10 transition-all duration-300"
              style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)' }}
            >
              ACCESS_REQ
            </button>
          )}
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center mt-3 text-xs font-mono">
          <div className={`w-2 h-2 rounded-full mr-2 ${product.is_active ? 'bg-neon-green animate-pulse' : 'bg-glitch-red'}`} />
          <span className={product.is_active ? 'text-neon-green' : 'text-glitch-red'}>
            {product.is_active ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
      </div>
      
      {/* Corner decorations */}
      <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-neon-cyan opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-neon-pink opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-neon-purple opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-neon-yellow opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  )
}
