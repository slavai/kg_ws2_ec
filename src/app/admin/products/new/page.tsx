import ProductForm from '@/components/admin/ProductForm'

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Создать продукт</h1>
        <p className="text-gray-600 mt-2">
          Добавьте новый продукт в каталог магазина
        </p>
      </div>

      <ProductForm mode="create" />
    </div>
  )
}