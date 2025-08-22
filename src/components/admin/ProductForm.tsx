'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Product } from '@/lib/types/database'

interface ProductFormProps {
  product?: Product | null
  mode: 'create' | 'edit'
}

interface FormData {
  name: string
  description: string
  image_url: string
  price: string
  is_active: boolean
}

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<FormData>({
    name: product?.name || '',
    description: product?.description || '',
    image_url: product?.image_url || '',
    price: product?.price?.toString() || '',
    is_active: product?.is_active ?? true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Client-side validation
    if (!formData.name.trim()) {
      setError('Название продукта обязательно')
      setIsLoading(false)
      return
    }

    const price = parseFloat(formData.price)
    if (isNaN(price) || price < 0) {
      setError('Цена должна быть положительным числом')
      setIsLoading(false)
      return
    }

    try {
      const endpoint = mode === 'create' 
        ? '/api/admin/products'
        : `/api/admin/products/${product?.id}`
      
      const method = mode === 'create' ? 'POST' : 'PUT'
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          image_url: formData.image_url.trim() || null,
          price: price,
          is_active: formData.is_active
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Ошибка при сохранении продукта')
      }

      // Redirect to products list on success
      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="cyber-card bg-cyber-dark border border-neon-purple neon-glow-purple">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="p-4 bg-glitch-red/20 border border-glitch-red rounded-cyber neon-glow-red">
            <p className="text-glitch-red text-sm font-cyber font-bold uppercase tracking-wider">[ERROR: {error}]</p>
          </div>
        )}

        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium neon-text-purple mb-2 font-cyber uppercase tracking-wider">
            [PRODUCT.NAME] *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 bg-cyber-black border border-neon-cyan text-neon-cyan placeholder-cyber-lighter rounded-cyber focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan disabled:bg-cyber-dark font-mono neon-glow-cyan"
            placeholder="[ENTER_PRODUCT_NAME.INPUT]"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium neon-text-green mb-2 font-cyber uppercase tracking-wider">
            [DESCRIPTION.TXT]
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            disabled={isLoading}
            rows={4}
            className="w-full px-3 py-2 bg-cyber-black border border-neon-green text-neon-green placeholder-cyber-lighter rounded-cyber focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-neon-green disabled:bg-cyber-dark font-mono text-sm neon-glow-green"
            placeholder="[ENTER_PRODUCT_DESCRIPTION.TXT]"
          />
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="image_url" className="block text-sm font-medium neon-text-yellow mb-2 font-cyber uppercase tracking-wider">
            [IMAGE_URL.LINK]
          </label>
          <input
            type="url"
            id="image_url"
            value={formData.image_url}
            onChange={(e) => handleChange('image_url', e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 bg-cyber-black border border-neon-yellow text-neon-yellow placeholder-cyber-lighter rounded-cyber focus:outline-none focus:ring-2 focus:ring-neon-yellow focus:border-neon-yellow disabled:bg-cyber-dark font-mono text-sm neon-glow-yellow"
            placeholder="[HTTPS://EXAMPLE.COM/IMAGE.JPG]"
          />
          {formData.image_url && (
            <div className="mt-2">
              <img 
                src={formData.image_url} 
                alt="[PREVIEW.IMG]"
                className="w-32 h-32 object-cover rounded-cyber border border-neon-yellow neon-glow-yellow"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            </div>
          )}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium neon-text-cyan mb-2 font-cyber uppercase tracking-wider">
            [PRICE.USD] *
          </label>
          <input
            type="number"
            id="price"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            disabled={isLoading}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 bg-cyber-black border border-neon-cyan text-neon-cyan placeholder-cyber-lighter rounded-cyber focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan disabled:bg-cyber-dark font-mono text-sm neon-glow-cyan"
            placeholder="[0.00]"
            required
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center p-4 bg-cyber-black border border-neon-green rounded-cyber neon-glow-green">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => handleChange('is_active', e.target.checked)}
            disabled={isLoading}
            className="h-4 w-4 text-neon-green focus:ring-neon-green border-neon-green rounded-cyber bg-cyber-dark"
          />
          <label htmlFor="is_active" className="ml-2 block text-sm neon-text-green font-cyber uppercase tracking-wider">
            [PRODUCT_ACTIVE.FLAG] - VISIBLE IN CATALOG
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-neon-purple">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
            className="cyber-card px-4 py-2 text-sm font-medium bg-cyber-dark border border-cyber-lighter text-cyber-lighter hover:neon-text-cyan hover:border-neon-cyan hover:neon-glow-cyan transition-all duration-300 disabled:opacity-50 font-cyber uppercase tracking-wider"
          >
            [CANCEL.BAT]
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="cyber-card px-4 py-2 text-sm font-medium bg-gradient-to-r from-neon-green/20 to-neon-cyan/20 border border-neon-green text-neon-green hover:neon-glow-green hover:glitch transition-all duration-300 disabled:opacity-50 font-cyber font-bold uppercase tracking-wider"
          >
            {isLoading ? '[SAVING.PROCESS]' : mode === 'create' ? '[CREATE_PRODUCT.EXE]' : '[SAVE_CHANGES.BAT]'}
          </button>
        </div>
      </form>
    </div>
  )
}