import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/supabase/products'
import ProductForm from '@/components/admin/ProductForm'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold neon-text-yellow font-cyber glitch-hover">
          [EDIT_PRODUCT.SYS]
        </h1>
        <p className="text-cyber-lighter mt-2 font-mono text-sm uppercase tracking-wider">
          &gt;&gt;&gt; MODIFY PRODUCT DATA: &quot;{product.name}&quot; &lt;&lt;&lt;
        </p>
      </div>

      <ProductForm mode="edit" product={product} />
    </div>
  )
}