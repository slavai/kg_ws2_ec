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
        <h1 className="text-3xl font-bold text-gray-900">Редактировать продукт</h1>
        <p className="text-gray-600 mt-2">
          Изменить информацию о продукте "{product.name}"
        </p>
      </div>

      <ProductForm mode="edit" product={product} />
    </div>
  )
}