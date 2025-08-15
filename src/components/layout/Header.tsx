'use client'

import { useState, useCallback, useMemo, memo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/auth/AuthModal'

const Header = memo(function Header() {
  const { user, userProfile, signOut, isLoading, isInitialized, error } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  // Throttled debug render only in development - reduce log spam
  if (process.env.NODE_ENV === 'development') {
    const debugInfo = { 
      hasUser: !!user, 
      hasUserProfile: !!userProfile, 
      isLoading,
      isInitialized,
      hasError: !!error,
      userEmail: user?.email,
      isAdmin: userProfile?.is_admin
    }
    // Only log when auth state actually changes, not on every render
    console.log('🎯 Header render:', JSON.stringify(debugInfo, null, 2))
  }

  // Memoize auth actions to prevent unnecessary re-renders
  const handleAuthAction = useCallback((mode: 'login' | 'register') => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }, [])

  const handleSignOut = useCallback(async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }, [signOut])

  const handleModalClose = useCallback(() => {
    setAuthModalOpen(false)
  }, [])

  // Memoize user info to prevent recalculation
  const userDisplayInfo = useMemo(() => {
    if (!userProfile && !user) return null
    
    return {
      displayName: userProfile?.full_name || user?.email || 'User',
      avatar: userProfile?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || '?',
      balance: userProfile?.balance || 0,
      isAdmin: userProfile?.is_admin || false
    }
  }, [user, userProfile])

  // Show loading skeleton during initialization
  if (isLoading && !isInitialized) {
    return <HeaderSkeleton />
  }

  return (
    <>
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">D</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Digital Store
                </h1>
              </a>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="/"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                Каталог
              </a>
              <a
                href="/cart"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors flex items-center space-x-1"
              >
                <span>Корзина</span>
                <span className="bg-blue-100 text-blue-800 text-xs rounded-full px-2 py-1">0</span>
              </a>
              {userDisplayInfo?.isAdmin && (
                <a
                  href="/admin/dashboard"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="text-base">⚙️</span>
                  <span>Админ-панель</span>
                </a>
              )}
            </nav>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {!isInitialized ? (
                <AuthSkeleton />
              ) : user && userDisplayInfo ? (
                <AuthenticatedUser 
                  userInfo={userDisplayInfo}
                  onSignOut={handleSignOut}
                />
              ) : (
                <UnauthenticatedButtons 
                  onAuthAction={handleAuthAction}
                />
              )}
              
              {error && (
                <div className="text-red-500 text-sm">
                  ⚠️ Auth Error
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={handleModalClose}
        defaultMode={authMode}
      />
    </>
  )
})

export default Header

// Skeleton components for better UX
function HeaderSkeleton() {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-lg animate-pulse"></div>
              <div className="w-32 h-6 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-8 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </header>
  )
}

function AuthSkeleton() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
      <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
    </div>
  )
}

interface UserDisplayInfo {
  displayName: string
  avatar: string
  balance: number
  isAdmin: boolean
}

const AuthenticatedUser = memo(function AuthenticatedUser({ 
  userInfo, 
  onSignOut 
}: { 
  userInfo: UserDisplayInfo
  onSignOut: () => void 
}) {
  return (
    <div className="flex items-center space-x-4">
      {/* User balance */}
      <div className="hidden sm:flex items-center space-x-2 bg-green-50 dark:bg-green-900 px-3 py-1 rounded-full">
        <span className="text-green-600 dark:text-green-400 text-sm font-medium">
          💰 ${userInfo.balance}
        </span>
      </div>
      
      {/* User menu */}
      <div className="relative group">
        <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {userInfo.avatar}
            </span>
          </div>
          <span className="hidden sm:block">
            {userInfo.displayName}
          </span>
        </button>
        
        {/* Dropdown menu */}
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <a
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Профиль
          </a>
          <a
            href="/orders"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Мои заказы
          </a>
          <a
            href="/my-products"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Мои продукты
          </a>
          <hr className="my-1 border-gray-200 dark:border-gray-600" />
          <button
            onClick={onSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  )
})

const UnauthenticatedButtons = memo(function UnauthenticatedButtons({ 
  onAuthAction 
}: { 
  onAuthAction: (mode: 'login' | 'register') => void 
}) {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onAuthAction('login')}
        className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
      >
        Войти
      </button>
      <button
        onClick={() => onAuthAction('register')}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Регистрация
      </button>
    </div>
  )
})