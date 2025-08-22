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
        <h1 className="text-3xl font-bold neon-text-purple font-cyber glitch-hover">
          [PRODUCTS.DB]
        </h1>
        <p className="text-cyber-lighter mt-2 font-mono text-sm uppercase tracking-wider">
          &gt;&gt;&gt; CREATE, EDIT &amp; MANAGE PRODUCT CATALOG &lt;&lt;&lt;
        </p>
      </div>

      <ProductList 
        initialProducts={products} 
        total={total}
      />
    </div>
  )
}