import { getProducts } from '@/lib/supabase/database'
import ProductCatalog from '@/components/products/ProductCatalog'

export default async function Home() {
  // Fetch products on server side
  const products = await getProducts({ limit: 8, activeOnly: true })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Добро пожаловать в Digital Store
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Цифровые продукты: купоны, лицензии, игры и многое другое
          </p>
          
          {/* Categories Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mb-16">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🎮</div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Игры</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Цифровые копии популярных игр
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">💻</div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Софт</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Лицензии на программное обеспечение
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🎫</div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Купоны</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Скидочные купоны и промокоды
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <ProductCatalog initialProducts={products} />
      </section>
    </div>
  );
}
