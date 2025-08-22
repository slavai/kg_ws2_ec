'use client'

import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import type { User as UserProfile } from '@/lib/types/database'

// Production-safe debug helper
const DEBUG_AUTH = process.env.NODE_ENV === 'development'
const debugLog = (message: string, data?: unknown) => {
  if (DEBUG_AUTH) {
    // Use JSON.stringify to properly show object content
    const dataStr = data ? (typeof data === 'object' ? JSON.stringify(data, null, 2) : data) : ''
    console.log(`🔐 AuthContext: ${message}`, dataStr)
  }
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  session: Session | null
  isLoading: boolean
  isInitialized: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  error: Error | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  session: null,
  isLoading: true,
  isInitialized: false,
  signOut: async () => {},
  refreshProfile: async () => {},
  error: null,
})

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  // Create supabase client singleton - move outside to prevent recreation
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  if (!supabaseRef.current) {
    supabaseRef.current = createClient()
  }
  const supabase = supabaseRef.current
  
  // Profile cache to avoid redundant requests - using ref to avoid closure issues
  const profileCache = useRef<Map<string, { profile: UserProfile | null, timestamp: number }>>(new Map())
  
  // Fetch user profile with caching and error handling
  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    const cacheKey = userId
    const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
    
    // Check cache without causing re-renders
    const cached = profileCache.current.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      debugLog('fetchUserProfile: using cached profile', { userId })
      return cached.profile
    }
    
    debugLog('fetchUserProfile: fetching from database', { userId })
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        debugLog('fetchUserProfile error', error instanceof Error ? error.message : String(error))
        throw new Error(`Failed to fetch user profile: ${error instanceof Error ? error.message : String(error)}`)
      }

      // Update cache
      profileCache.current.set(cacheKey, { 
        profile: data, 
        timestamp: Date.now() 
      })

      debugLog('fetchUserProfile success', { email: data.email, isAdmin: data.is_admin })
      return data
    } catch (error: unknown) {
      debugLog('fetchUserProfile exception', error instanceof Error ? error.message : String(error))
      setError(error instanceof Error ? error : new Error('Unknown error'))
      return null
    }
  }, []) // Remove supabase dependency since it's now stable

  const refreshProfile = useCallback(async () => {
    if (!user?.id) {
      debugLog('refreshProfile: no user to refresh')
      return
    }
    
    debugLog('refreshProfile: forcing refresh')
    // Clear cache for current user
    profileCache.current.delete(user.id)
    
    // Call fetchUserProfile directly to avoid dependency chain
    const cacheKey = user.id
    const CACHE_TTL = 5 * 60 * 1000
    
    try {
      debugLog('refreshProfile: fetching fresh profile from database')
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        debugLog('refreshProfile error', error instanceof Error ? error.message : String(error))
        setError(new Error(`Failed to refresh user profile: ${error instanceof Error ? error.message : String(error)}`))
        return
      }

      // Update cache
      profileCache.current.set(cacheKey, { 
        profile: data, 
        timestamp: Date.now() 
      })

      setUserProfile(data)
      debugLog('refreshProfile success', { email: data.email, isAdmin: data.is_admin })
    } catch (error: unknown) {
      debugLog('refreshProfile exception', error instanceof Error ? error.message : String(error))
      setError(error instanceof Error ? error : new Error('Unknown error'))
    }
  }, [user?.id]) // Remove supabase dependency

  const signOut = useCallback(async () => {
    debugLog('signOut: initiating sign out')
    try {
      setError(null)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Clear caches
      profileCache.current.clear()
      debugLog('signOut: successful')
    } catch (error: unknown) {
      debugLog('signOut error', error instanceof Error ? error.message : String(error))
      setError(error instanceof Error ? error : new Error('Unknown error'))
      throw error
    }
  }, []) // Remove supabase dependency

  // Initialize auth state - using standard Supabase pattern with enhancements
  useEffect(() => {
    let mounted = true
    
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session }, error }: { data: { session: Session | null }, error: unknown }) => {
      if (!mounted) return
      
      debugLog('getSession result', { hasSession: !!session, error: !!error })
      
      if (error) {
        debugLog('getSession error', error instanceof Error ? error.message : String(error))
        setError(error instanceof Error ? error : new Error('Unknown error'))
      }
      
      // Set initial session state
      setSession(session)
      setUser(session?.user ?? null)
      
      // Load profile if user exists - inline to avoid dependency issues
      if (session?.user) {
        try {
          const userId = session.user.id
          debugLog('loading initial profile', { userId })
          
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single()

          if (profileError) {
            debugLog('initial profile error', profileError.message)
            if (mounted) {
              setError(new Error(`Failed to load user profile: ${profileError.message}`))
            }
          } else if (mounted) {
            setUserProfile(profileData)
            debugLog('initial profile loaded', { email: profileData.email })
            
            // Cache the profile
            profileCache.current.set(userId, { 
              profile: profileData, 
              timestamp: Date.now() 
            })
          }
        } catch (profileError: unknown) {
          debugLog('initial profile exception', profileError instanceof Error ? profileError.message : String(profileError))
          if (mounted) {
            setError(profileError instanceof Error ? profileError : new Error('Unknown error'))
          }
        }
      }
      
      // Complete initialization
      if (mounted) {
        setIsLoading(false)
        setIsInitialized(true)
        debugLog('initial session setup complete')
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, session: Session | null) => {
      debugLog('auth state change', { event, hasUser: !!session?.user })
      
      if (!mounted) return

      try {
        setError(null)
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Load profile inline to avoid dependency issues
          const userId = session.user.id
          debugLog('auth state change: loading profile', { userId })
          
          // Check cache first
          const cached = profileCache.current.get(userId)
          const CACHE_TTL = 5 * 60 * 1000
          
          if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            debugLog('auth state change: using cached profile')
            if (mounted) {
              setUserProfile(cached.profile)
            }
          } else {
            debugLog('auth state change: fetching fresh profile')
            
            const { data: profileData, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', userId)
              .single()

            if (profileError) {
              debugLog('auth state change profile error', profileError.message)
              if (mounted) {
                setError(new Error(`Failed to load user profile: ${profileError.message}`))
              }
            } else if (mounted) {
              setUserProfile(profileData)
              debugLog('auth state change profile loaded', { email: profileData.email })
              
              // Update cache
              profileCache.current.set(userId, { 
                profile: profileData, 
                timestamp: Date.now() 
              })
            }
          }
        } else {
          setUserProfile(null)
          profileCache.current.clear()
          debugLog('auth state change: user signed out')
        }
      } catch (error: unknown) {
        debugLog('auth state change error', error instanceof Error ? error.message : String(error))
        if (mounted) {
          setError(error instanceof Error ? error : new Error('Unknown error'))
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, []) // Supabase client is now stable, no dependencies needed

  // Memoize context value to prevent unnecessary re-renders
  // Include all dependencies including functions
  const contextValue = useMemo(() => {
    debugLog('Context value recreated', { 
      hasUser: !!user,
      hasProfile: !!userProfile,
      hasSession: !!session,
      isLoading,
      isInitialized,
      hasError: !!error
    })
    
    return {
      user,
      userProfile,
      session,
      isLoading,
      isInitialized,
      signOut,
      refreshProfile,
      error,
    }
  }, [user, userProfile, session, isLoading, isInitialized, error, signOut, refreshProfile])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}