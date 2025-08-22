'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store'

export default function TestDBPage() {
  const { user, userProfile, isLoading } = useAuth()
  const reduxState = useSelector((state: RootState) => state)

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">🧪 Тест подключения к БД и Redux</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Redux Status */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-green-600">✅ Redux Store Status</h2>
          <div className="space-y-2">
            <p><strong>Store инициализирован:</strong> {reduxState ? 'Да' : 'Нет'}</p>
            <p><strong>Temp slice:</strong> {reduxState.temp ? 'Да' : 'Нет'}</p>
            <p><strong>Initialized:</strong> {reduxState.temp?.initialized ? 'true' : 'false'}</p>
          </div>
          <details className="mt-4">
            <summary className="cursor-pointer text-blue-600">Redux State (JSON)</summary>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(reduxState, null, 2)}
            </pre>
          </details>
        </div>

        {/* Auth Status */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">🔐 Auth Status</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {isLoading ? 'Да' : 'Нет'}</p>
            <p><strong>User авторизован:</strong> {user ? 'Да' : 'Нет'}</p>
            <p><strong>Profile загружен:</strong> {userProfile ? 'Да' : 'Нет'}</p>
            {user && (
              <div className="mt-4">
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
            )}
            {userProfile && (
              <div className="mt-4 p-3 bg-green-50 rounded">
                <p><strong>Full Name:</strong> {userProfile.full_name}</p>
                <p><strong>Balance:</strong> ${userProfile.balance}</p>
                <p><strong>Is Admin:</strong> {userProfile.is_admin ? 'Да' : 'Нет'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Console Errors Check */}
      <div className="mt-8 bg-yellow-50 dark:bg-yellow-900 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-yellow-800 dark:text-yellow-200">
          ⚠️ Проверка консольных ошибок
        </h2>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          Откройте консоль браузера (F12 → Console) и проверьте:
        </p>
        <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside space-y-1">
          <li>Нет ошибок &quot;Store does not have a valid reducer&quot;</li>
          <li>Нет ошибок &quot;Error fetching user profile: {}&quot;</li>
          <li>Redux store инициализирован корректно</li>
          <li>Auth context работает без ошибок</li>
        </ul>
      </div>
    </div>
  )
}