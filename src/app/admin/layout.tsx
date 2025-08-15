import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  // Check if user is authenticated and is admin
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/?redirected=true&message=Требуется авторизация')
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('is_admin, full_name, email')
    .eq('id', user.id)
    .single()

  if (!userProfile?.is_admin) {
    redirect('/?redirected=true&message=Недостаточно прав доступа')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  Админ-панель
                </h1>
              </div>
              
              {/* Admin Navigation */}
              <nav className="hidden md:flex items-center space-x-6 ml-8">
                <a
                  href="/admin/dashboard"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Дашборд
                </a>
                <a
                  href="/admin/products"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Продукты
                </a>
              </nav>
            </div>

            {/* Admin User Info */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {userProfile.full_name || userProfile.email}
                </div>
                <div className="text-xs text-orange-600 font-medium">
                  Администратор
                </div>
              </div>
              <a
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
              >
                <span>🌐</span>
                <span>Перейти на сайт</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}