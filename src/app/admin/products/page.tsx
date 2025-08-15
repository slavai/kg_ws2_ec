import { getAllProducts } from '@/lib/supabase/products'
import ProductList from '@/components/admin/ProductList'

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const search = typeof params.search === 'string' ? params.search : undefined
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1
  const limit = 10
  const offset = (page - 1) * limit

  const { products, total } = await getAllProducts({ 
    limit, 
    offset, 
    search 
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Управление продуктами</h1>
        <p className="text-gray-600 mt-2">
          Создавайте, редактируйте и управляйте каталогом продуктов
        </p>
      </div>

      <ProductList 
        initialProducts={products} 
        total={total}
      />
    </div>
  )
}