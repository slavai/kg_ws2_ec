import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  // Get dashboard statistics
  const [
    { count: totalProducts },
    { count: activeProducts },
    { count: totalUsers },
    { count: totalOrders }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true })
  ])

  const stats = [
    {
      title: "Всего продуктов",
      value: totalProducts || 0,
      icon: "📦",
      color: "blue"
    },
    {
      title: "Активных продуктов", 
      value: activeProducts || 0,
      icon: "✅",
      color: "green"
    },
    {
      title: "Пользователей",
      value: totalUsers || 0,
      icon: "👥",
      color: "purple"
    },
    {
      title: "Заказов",
      value: totalOrders || 0,
      icon: "🛒",
      color: "orange"
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Дашборд</h1>
        <p className="text-gray-600 mt-2">
          Общая статистика и управление магазином
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">{stat.icon}</div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold text-${stat.color}-600`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Быстрые действия
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/products/new"
            className="block p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">➕</div>
              <div className="font-medium text-gray-900">Добавить продукт</div>
              <div className="text-sm text-gray-500">Создать новый продукт</div>
            </div>
          </a>
          
          <a
            href="/admin/products"
            className="block p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📦</div>
              <div className="font-medium text-gray-900">Управление продуктами</div>
              <div className="text-sm text-gray-500">Просмотр и редактирование</div>
            </div>
          </a>
          
          <a
            href="/"
            className="block p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🌐</div>
              <div className="font-medium text-gray-900">Перейти на сайт</div>
              <div className="text-sm text-gray-500">Посмотреть как видят клиенты</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}