import { createClient } from './client'
import type { User, Session } from '@supabase/supabase-js'

export interface SignUpData {
  email: string
  password: string
  fullName?: string
  metadata?: Record<string, unknown>
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthResult {
  user: User | null
  session: Session | null
}

// Enhanced error messages for better UX
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'Invalid login credentials': 'Неверный email или пароль',
  'Email not confirmed': 'Подтвердите email перед входом',
  'Invalid email': 'Некорректный email адрес',
  'Password should be at least 6 characters': 'Пароль должен содержать минимум 6 символов',
  'User not found': 'Пользователь не найден',
  'Too many requests': 'Слишком много попыток входа. Попробуйте позже',
  'Email already registered': 'Пользователь с таким email уже зарегистрирован',
}

function formatAuthError(error: unknown): string {
  const message = (error instanceof Error ? error.message : null) || 'Произошла неизвестная ошибка'
  return AUTH_ERROR_MESSAGES[message] || message
}

/**
 * Sign up a new user
 */
export async function signUp({ email, password, fullName, metadata }: SignUpData): Promise<AuthResult> {
  const supabase = createClient()
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🔑 signUp: starting registration', { email, fullName })
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
          ...metadata
        },
      },
    })

    if (error) {
      throw new Error(formatAuthError(error))
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('🔑 signUp: success', { hasUser: !!data.user, needsConfirmation: !data.session })
    }

    return {
      user: data.user,
      session: data.session,
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('🔑 signUp: error', error)
    }
    throw error
  }
}

/**
 * Sign in with email and password
 */
export async function signIn({ email, password }: SignInData): Promise<AuthResult> {
  const supabase = createClient()
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🔑 signIn: starting authentication', { email })
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(formatAuthError(error))
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('🔑 signIn: success', { hasUser: !!data.user, hasSession: !!data.session })
    }

    return {
      user: data.user,
      session: data.session,
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('🔑 signIn: error', error)
    }
    throw error
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  const supabase = createClient()
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🔑 signOut: starting sign out')
  }

  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw new Error(formatAuthError(error))
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('🔑 signOut: success')
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('🔑 signOut: error', error)
    }
    throw error
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('🔑 getCurrentUser: error', error)
      }
      return null
    }

    return user
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('🔑 getCurrentUser: exception', error)
    }
    return null
  }
}

/**
 * Get current session
 */
export async function getCurrentSession(): Promise<Session | null> {
  const supabase = createClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('🔑 getCurrentSession: error', error)
      }
      return null
    }

    return session
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('🔑 getCurrentSession: exception', error)
    }
    return null
  }
}

/**
 * Reset password for user
 */
export async function resetPassword(email: string): Promise<void> {
  const supabase = createClient()
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🔑 resetPassword: sending reset email', { email })
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      throw new Error(formatAuthError(error))
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('🔑 resetPassword: email sent successfully')
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('🔑 resetPassword: error', error)
    }
    throw error
  }
}

/**
 * Update user password
 */
export async function updatePassword(newPassword: string): Promise<void> {
  const supabase = createClient()
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🔑 updatePassword: updating password')
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      throw new Error(formatAuthError(error))
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('🔑 updatePassword: password updated successfully')
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('🔑 updatePassword: error', error)
    }
    throw error
  }
}