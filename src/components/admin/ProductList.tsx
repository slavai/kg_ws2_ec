'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Product } from '@/lib/types/database'

interface ProductListProps {
  initialProducts: Product[]
  total: number
}

export default function ProductList({ initialProducts, total }: ProductListProps) {
  const router = useRouter()
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Delete product handler
  const handleDelete = async (product: Product) => {
    if (!confirm(`Вы уверены, что хотите удалить продукт "${product.name}"?`)) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Ошибка при удалении продукта')
      }

      // Remove product from list
      setProducts(prev => prev.filter(p => p.id !== product.id))
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Произошла ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle product status handler
  const handleToggleStatus = async (product: Product) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !product.is_active })
      })

      if (!response.ok) {
        throw new Error('Ошибка при изменении статуса продукта')
      }

      const updatedProduct = await response.json()
      
      // Update product in list
      setProducts(prev => prev.map(p => 
        p.id === product.id ? updatedProduct : p
      ))
      
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Произошла ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const searchParams = new URLSearchParams()
    if (search.trim()) {
      searchParams.set('search', search.trim())
    }
    router.push(`/admin/products?${searchParams.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Найти
          </button>
        </form>
        
        <a
          href="/admin/products/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
        >
          <span>+</span>
          Добавить продукт
        </a>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Продукты ({total})
          </h3>
        </div>

        {products.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-gray-400 text-4xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Продукты не найдены
            </h3>
            <p className="text-gray-500 mb-4">
              {search ? 'Попробуйте изменить поисковый запрос' : 'Начните с создания первого продукта'}
            </p>
            <a
              href="/admin/products/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Создать продукт
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Продукт
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Цена
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Создан
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          {product.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${product.price}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(product)}
                        disabled={isLoading}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                          product.is_active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        } disabled:opacity-50`}
                      >
                        {product.is_active ? 'Активен' : 'Неактивен'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <a
                        href={`/admin/products/${product.id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Редактировать
                      </a>
                      <button
                        onClick={() => handleDelete(product)}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}