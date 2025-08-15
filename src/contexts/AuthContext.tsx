'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import type { User as UserProfile } from '@/lib/types/database'

// Debug helper
const DEBUG_AUTH = true
const debugLog = (message: string, data?: any) => {
  if (DEBUG_AUTH) {
    console.log(`🔐 AuthContext: ${message}`, data || '')
  }
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  isLoading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  isLoading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  debugLog('AuthProvider initialized', { user: !!user, userProfile: !!userProfile, isLoading })

  const fetchUserProfile = async (userId: string) => {
    debugLog('fetchUserProfile started', { userId })
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      debugLog('fetchUserProfile query result', { data, error })

      if (error) {
        debugLog('Error fetching user profile', error)
        return null
      }

      debugLog('fetchUserProfile success', data)
      return data
    } catch (error) {
      debugLog('fetchUserProfile exception', error)
      return null
    }
  }

  const refreshProfile = async () => {
    debugLog('refreshProfile called', { hasUser: !!user })
    if (user) {
      const profile = await fetchUserProfile(user.id)
      debugLog('refreshProfile completed', { profile })
      setUserProfile(profile)
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id).then(setUserProfile)
      }
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id)
        setUserProfile(profile)
      } else {
        setUserProfile(null)
      }
      
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = {
    user,
    userProfile,
    isLoading,
    signOut,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}