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
    <div className="bg-white rounded-lg shadow">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Название продукта *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            placeholder="Введите название продукта"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Описание
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            disabled={isLoading}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            placeholder="Введите описание продукта"
          />
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
            URL изображения
          </label>
          <input
            type="url"
            id="image_url"
            value={formData.image_url}
            onChange={(e) => handleChange('image_url', e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            placeholder="https://example.com/image.jpg"
          />
          {formData.image_url && (
            <div className="mt-2">
              <img 
                src={formData.image_url} 
                alt="Превью"
                className="w-32 h-32 object-cover rounded-md border"
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
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Цена (USD) *
          </label>
          <input
            type="number"
            id="price"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            disabled={isLoading}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            placeholder="0.00"
            required
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => handleChange('is_active', e.target.checked)}
            disabled={isLoading}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
            Продукт активен (отображается в каталоге)
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Отмена
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Сохранение...' : mode === 'create' ? 'Создать продукт' : 'Сохранить изменения'}
          </button>
        </div>
      </form>
    </div>
  )
}