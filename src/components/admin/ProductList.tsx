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
            placeholder="[SEARCH_QUERY.INPUT]"
            className="flex-1 px-3 py-2 bg-cyber-dark border border-neon-cyan text-neon-cyan placeholder-cyber-lighter rounded-cyber focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan font-mono text-sm"
          />
          <button
            type="submit"
            className="cyber-card px-4 py-2 bg-cyber-dark border border-neon-purple text-neon-purple hover:neon-glow-purple hover:glitch transition-all duration-300 font-cyber font-bold uppercase tracking-wider"
          >
            [SCAN.EXE]
          </button>
        </form>
        
        <a
          href="/admin/products/new"
          className="cyber-card px-4 py-2 bg-gradient-to-r from-neon-green/20 to-neon-cyan/20 border border-neon-green text-neon-green hover:neon-glow-green hover:glitch transition-all duration-300 flex items-center gap-2 font-cyber font-bold uppercase tracking-wider"
        >
          <span className="text-lg pulse-soft">+</span>
          [ADD_PRODUCT.BAT]
        </a>
      </div>

      {/* Products Table */}
      <div className="cyber-card bg-cyber-dark border border-neon-purple neon-glow-purple overflow-hidden">
        <div className="px-6 py-4 border-b border-neon-purple">
          <h3 className="text-lg font-medium neon-text-purple font-cyber uppercase tracking-wider">
            [PRODUCTS_DB.COUNT: {total}]
          </h3>
        </div>

        {products.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-glitch-red text-4xl mb-4 pulse-soft">📦</div>
            <h3 className="text-lg font-medium neon-text-red font-cyber mb-2 uppercase tracking-wider">
              [ERROR: NO_PRODUCTS_FOUND]
            </h3>
            <p className="text-cyber-lighter mb-4 font-mono text-sm">
              {search ? '[TRY_DIFFERENT_SEARCH_QUERY.BAT]' : '[CREATE_FIRST_PRODUCT.EXE]'}
            </p>
            <a
              href="/admin/products/new"
              className="cyber-card inline-flex items-center px-4 py-2 bg-gradient-to-r from-neon-green/20 to-neon-cyan/20 border border-neon-green text-neon-green hover:neon-glow-green hover:glitch transition-all duration-300 font-cyber font-bold uppercase tracking-wider"
            >
              [CREATE_PRODUCT.EXE]
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neon-purple">
              <thead className="bg-cyber-black border-b border-neon-purple">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neon-purple uppercase tracking-wider font-cyber">
                    [PRODUCT.NAME]
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neon-cyan uppercase tracking-wider font-cyber">
                    [PRICE.USD]
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neon-green uppercase tracking-wider font-cyber">
                    [STATUS.FLAG]
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neon-yellow uppercase tracking-wider font-cyber">
                    [CREATE.DATE]
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-glitch-red uppercase tracking-wider font-cyber">
                    [ACTIONS.EXE]
                  </th>
                </tr>
              </thead>
              <tbody className="bg-cyber-black divide-y divide-cyber-dark">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-cyber-dark/50 hover:glitch-hover transition-all duration-300">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-cyber border border-neon-cyan mr-3 neon-glow-cyan"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium neon-text-purple font-cyber">
                            {product.name}
                          </div>
                          {product.description && (
                            <div className="text-sm text-cyber-lighter truncate max-w-xs font-mono">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium neon-text-cyan font-cyber">
                        ${product.price} [USD]
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(product)}
                        disabled={isLoading}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-cyber transition-all duration-300 font-cyber uppercase tracking-wider ${
                          product.is_active
                            ? 'bg-neon-green/20 border border-neon-green text-neon-green hover:neon-glow-green hover:glitch'
                            : 'bg-glitch-red/20 border border-glitch-red text-glitch-red hover:neon-glow-red hover:glitch'
                        } disabled:opacity-50`}
                      >
                        {product.is_active ? '[ACTIVE]' : '[INACTIVE]'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neon-yellow font-mono">
                      [{new Date(product.created_at).toLocaleDateString('ru-RU')}]
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <a
                        href={`/admin/products/${product.id}/edit`}
                        className="cyber-card inline-flex items-center px-3 py-1 bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 border border-neon-cyan text-neon-cyan hover:neon-glow-cyan hover:glitch transition-all duration-300 font-cyber text-xs uppercase tracking-wider"
                      >
                        [EDIT.SYS]
                      </a>
                      <button
                        onClick={() => handleDelete(product)}
                        disabled={isLoading}
                        className="cyber-card inline-flex items-center px-3 py-1 bg-gradient-to-r from-glitch-red/20 to-neon-pink/20 border border-glitch-red text-glitch-red hover:neon-glow-red hover:glitch transition-all duration-300 font-cyber text-xs uppercase tracking-wider disabled:opacity-50"
                      >
                        [DELETE.BAT]
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