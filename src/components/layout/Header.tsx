'use client'

import { useState, useCallback, useMemo, memo, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/auth/AuthModal'
import { useAppDispatch, useCartItemCount } from '@/lib/redux/hooks'
import { fetchCart } from '@/lib/redux/slices/cartSlice'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/hooks/useLocale'
import Link from 'next/link'

const Header = memo(function Header() {
  const { user, userProfile, signOut, isLoading, isInitialized, error } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  
  // Redux cart state
  const dispatch = useAppDispatch()
  const cartItemCount = useCartItemCount()
  
  // Локализация
  const t = useTranslations('Header')
  const { locale, setLocale, availableLocales, isLoading: localeLoading } = useLocale()

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (user) {
      dispatch(fetchCart())
    }
  }, [user, dispatch])

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
      <header className="bg-cyber-black border-b-2 border-neon-cyan shadow-neon-cyan relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-cyber-dark border border-neon-cyan rounded-cyber flex items-center justify-center neon-glow-cyan group-hover:glitch transition-all duration-300">
                  <span className="text-neon-cyan font-bold text-lg font-cyber">D</span>
                </div>
                <h1 className="text-xl font-bold neon-text-cyan font-cyber group-hover:neon-text-pink transition-colors duration-300">
                  DIGITAL_STORE.SYS
                </h1>
              </Link>
            </div>

            {/* Navigation and Controls */}
            <div className="flex items-center space-x-6">
              {/* Main Navigation */}
              <nav className="hidden lg:flex items-center space-x-6">
                <Link
                  href="/"
                  className="text-cyber-lighter hover:neon-text-cyan transition-all duration-300 font-mono text-sm uppercase tracking-wider hover:glitch-hover relative"
                >
                  [{t('products').toUpperCase()}.DB]
                </Link>
                <Link
                  href="/cart"
                  className="text-cyber-lighter hover:neon-text-pink transition-all duration-300 font-mono text-sm uppercase tracking-wider flex items-center space-x-2 hover:glitch-hover relative"
                >
                  <span>[{t('cart').toUpperCase()}.SYS]</span>
                  {cartItemCount > 0 && (
                    <span className="bg-cyber-dark border border-glitch-red text-glitch-red neon-glow-pink text-xs px-2 py-1 min-w-[20px] text-center font-cyber pulse-soft">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  )}
                </Link>
                {userDisplayInfo?.isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="cyber-card bg-gradient-to-r from-glitch-red/20 to-neon-purple/20 border border-glitch-red hover:neon-glow-pink text-glitch-red px-3 py-1 text-xs font-cyber font-bold transition-all duration-300 flex items-center space-x-1 hover:glitch uppercase tracking-wider"
                  >
                    <span className="text-sm pulse-soft">⚙️</span>
                    <span>ADMIN</span>
                  </Link>
                )}
              </nav>

              {/* Right Side Controls */}
              <div className="flex items-center space-x-3">
                {/* Language Switcher */}
                <LanguageSwitcher 
                  currentLocale={locale}
                  onLocaleChange={setLocale}
                  availableLocales={availableLocales}
                  isLoading={localeLoading}
                />
                
                {/* Auth Section */}
                <div className="flex items-center">
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
                </div>
              </div>
            </div>
            
            {/* Error Display */}
            {error && (
              <div className="text-glitch-red text-sm font-cyber pulse-soft bg-cyber-dark border border-glitch-red px-2 py-1 rounded-cyber neon-glow-pink">
                ⚠️ [AUTH_ERROR.LOG]
              </div>
            )}
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
    <header className="bg-cyber-black border-b-2 border-neon-cyan shadow-neon-cyan">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-cyber-dark border border-neon-cyan rounded-cyber pulse-soft"></div>
              <div className="w-32 h-6 bg-cyber-dark rounded-cyber pulse-soft"></div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-8 bg-cyber-dark rounded-cyber pulse-soft"></div>
          </div>
        </div>
      </div>
    </header>
  )
}

function AuthSkeleton() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-16 h-8 bg-cyber-dark border border-neon-cyan rounded-cyber pulse-soft"></div>
      <div className="w-20 h-8 bg-cyber-dark border border-neon-pink rounded-cyber pulse-soft"></div>
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
  const t = useTranslations('Header')
  const tCommon = useTranslations('Common')
  return (
    <div className="flex items-center space-x-4">
      {/* User balance */}
      <div className="hidden sm:flex items-center space-x-2 bg-cyber-dark border border-neon-green px-3 py-1 rounded-cyber neon-glow-green">
        <span className="text-neon-green text-sm font-cyber font-bold pulse-soft">
          💰 ${userInfo.balance} {tCommon('credits')}
        </span>
      </div>
      
      {/* User menu */}
      <div className="relative group">
        <button className="flex items-center space-x-2 text-cyber-lighter hover:neon-text-cyan transition-all duration-300 hover:glitch-hover">
          <div className="w-8 h-8 bg-cyber-dark border border-neon-cyan rounded-cyber flex items-center justify-center neon-glow-cyan group-hover:glitch">
            <span className="text-neon-cyan text-sm font-cyber font-bold">
              {userInfo.avatar}
            </span>
          </div>
          <span className="hidden sm:block font-cyber text-sm uppercase tracking-wider">
            [{userInfo.displayName}]
          </span>
        </button>
        
        {/* Dropdown menu */}
        <div className="absolute right-0 mt-2 w-56 bg-cyber-black border border-neon-cyan rounded-cyber shadow-neon-cyan py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-cyber-lighter hover:text-neon-cyan hover:bg-cyber-dark transition-all duration-300 font-mono uppercase tracking-wider border-l-2 border-transparent hover:border-neon-cyan"
          >
            [{t('profile').toUpperCase()}.CFG]
          </Link>
          <Link
            href="/orders"
            className="block px-4 py-2 text-sm text-cyber-lighter hover:text-neon-pink hover:bg-cyber-dark transition-all duration-300 font-mono uppercase tracking-wider border-l-2 border-transparent hover:border-neon-pink"
          >
            [{t('orders').toUpperCase()}.LOG]
          </Link>
          <Link
            href="/my-products"
            className="block px-4 py-2 text-sm text-cyber-lighter hover:text-neon-purple hover:bg-cyber-dark transition-all duration-300 font-mono uppercase tracking-wider border-l-2 border-transparent hover:border-neon-purple"
          >
            [{t('myProducts').toUpperCase().replace(/\s/g, '_')}.DB]
          </Link>
          <hr className="my-2 border-neon-cyan opacity-50" />
          <button
            onClick={onSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-glitch-red hover:text-white hover:bg-glitch-red/20 transition-all duration-300 font-mono uppercase tracking-wider border-l-2 border-transparent hover:border-glitch-red hover:glitch-hover"
          >
            [{t('logout').toUpperCase()}.EXE]
          </button>
        </div>
      </div>
    </div>
  )
})

// Компонент переключателя языка
const LanguageSwitcher = memo(function LanguageSwitcher({
  currentLocale,
  onLocaleChange,
  availableLocales,
  isLoading
}: {
  currentLocale: string
  onLocaleChange: (locale: 'en' | 'ua') => void
  availableLocales: readonly string[]
  isLoading: boolean
}) {
  const localeLabels: Record<string, { name: string; flag: string }> = {
    'en': { name: 'EN', flag: '🇺🇸' },
    'ua': { name: 'UA', flag: '🇺🇦' }
  }

  if (isLoading) {
    return (
      <div className="w-20 h-10 bg-cyber-dark border border-neon-cyan rounded-cyber pulse-soft"></div>
    )
  }

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 bg-cyber-dark border border-neon-cyan text-neon-cyan px-4 py-2 rounded-cyber hover:neon-glow-cyan transition-all duration-300 font-mono text-sm font-bold hover:glitch min-w-[80px]">
        <span className="text-base">{localeLabels[currentLocale]?.flag}</span>
        <span className="uppercase tracking-wider">
          {localeLabels[currentLocale]?.name || currentLocale}
        </span>
      </button>
      
      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-36 bg-cyber-black border border-neon-cyan rounded-cyber shadow-neon-cyan py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
        {availableLocales.map((locale) => (
          <button
            key={locale}
            onClick={() => onLocaleChange(locale as 'en' | 'ua')}
            className={`block w-full text-left px-4 py-3 text-sm hover:bg-cyber-dark transition-all duration-300 font-mono uppercase tracking-wider border-l-2 border-transparent hover:border-neon-cyan flex items-center space-x-3 ${
              locale === currentLocale 
                ? 'text-neon-cyan border-l-2 border-neon-cyan bg-cyber-dark' 
                : 'text-cyber-lighter hover:text-neon-cyan'
            }`}
          >
            <span className="text-base">{localeLabels[locale]?.flag}</span>
            <span>{localeLabels[locale]?.name || locale}</span>
          </button>
        ))}
      </div>
    </div>
  )
})

const UnauthenticatedButtons = memo(function UnauthenticatedButtons({ 
  onAuthAction 
}: { 
  onAuthAction: (mode: 'login' | 'register') => void 
}) {
  const t = useTranslations('Header')
  
  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={() => onAuthAction('login')}
        className="text-cyber-lighter hover:neon-text-cyan transition-all duration-300 font-mono text-sm uppercase tracking-wider hover:glitch-hover"
      >
        [{t('login').toUpperCase()}]
      </button>
      <button
        onClick={() => onAuthAction('register')}
        className="bg-cyber-dark border border-neon-pink text-neon-pink px-4 py-2 rounded-cyber hover:neon-glow-pink hover:bg-neon-pink/10 transition-all duration-300 font-mono text-sm font-bold uppercase tracking-wider hover:glitch"
      >
        [{t('register').toUpperCase()}.BAT]
      </button>
    </div>
  )
})