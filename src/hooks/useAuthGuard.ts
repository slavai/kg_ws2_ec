'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface AuthGuardOptions {
  requiredRole?: 'admin' | 'user'
  redirectTo?: string
  onUnauthorized?: () => void
}

export function useAuthGuard(options: AuthGuardOptions = {}) {
  const { user, userProfile, isLoading, isInitialized } = useAuth()
  const router = useRouter()
  
  const {
    requiredRole,
    redirectTo = '/',
    onUnauthorized
  } = options

  useEffect(() => {
    // Don't redirect during initial loading
    if (!isInitialized) return
    
    // User not authenticated
    if (!user) {
      onUnauthorized?.()
      router.push(`${redirectTo}?auth=required`)
      return
    }

    // Check role requirement
    if (requiredRole === 'admin' && !userProfile?.is_admin) {
      onUnauthorized?.()
      router.push(`${redirectTo}?error=insufficient_permissions`)
      return
    }
  }, [user, userProfile, isInitialized, requiredRole, redirectTo, onUnauthorized, router])

  return {
    isAuthenticated: !!user,
    isAuthorized: requiredRole === 'admin' ? !!userProfile?.is_admin : !!user,
    isLoading,
    isInitialized,
    user,
    userProfile
  }
}

// Convenience hooks for common use cases
export function useRequireAuth(redirectTo?: string) {
  return useAuthGuard({ redirectTo })
}

export function useRequireAdmin(redirectTo?: string) {
  return useAuthGuard({ 
    requiredRole: 'admin',
    redirectTo: redirectTo || '/'
  })
}
