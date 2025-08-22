import ProductForm from '@/components/admin/ProductForm'

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold neon-text-green font-cyber glitch-hover">
          [CREATE_PRODUCT.EXE]
        </h1>
        <p className="text-cyber-lighter mt-2 font-mono text-sm uppercase tracking-wider">
          &gt;&gt;&gt; ADD NEW PRODUCT TO CATALOG DATABASE &lt;&lt;&lt;
        </p>
      </div>

      <ProductForm mode="create" />
    </div>
  )
}