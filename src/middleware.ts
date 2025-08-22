import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Cache user profiles to avoid repeated DB calls
const userProfileCache = new Map<string, { isAdmin: boolean, timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Создаем i18n middleware
const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Сначала обрабатываем i18n
  const response = intlMiddleware(request);
  
  // Если i18n middleware вернул редирект, используем его
  if (response instanceof Response && response.status !== 200) {
    return response;
  }
  
  // Продолжаем с auth middleware
  let authResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          authResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            authResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  try {
    const pathname = request.nextUrl.pathname
    
    // Refresh session if expired - required for Server Components
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      // Only log errors for protected routes, ignore for public routes
      const isProtectedRoute = pathname.startsWith('/admin') || 
                              pathname.startsWith('/profile') || 
                              pathname.startsWith('/orders') || 
                              pathname.startsWith('/my-products') || 
                              pathname.startsWith('/cart') ||
                              pathname.startsWith('/api/admin')
      
      if (isProtectedRoute) {
        console.error('Middleware auth error for protected route:', error)
      }
      // Continue without user for public routes
    }

    // Helper function to check if user is admin with caching
    const isUserAdmin = async (userId: string): Promise<boolean> => {
      const cached = userProfileCache.get(userId)
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.isAdmin
      }

      try {
        const { data: userProfile } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', userId)
          .single()

        const isAdmin = userProfile?.is_admin || false
        userProfileCache.set(userId, { isAdmin, timestamp: Date.now() })
        return isAdmin
      } catch (error) {
        console.error('Error checking admin status:', error)
        return false
      }
    }

    // Create redirect helper
    const createRedirect = (message: string, targetPath: string = '/') => {
      const redirectUrl = new URL(targetPath, request.url)
      redirectUrl.searchParams.set('auth_error', message)
      return NextResponse.redirect(redirectUrl)
    }

    // Protected admin routes
    if (pathname.startsWith('/admin')) {
      if (!user) {
        return createRedirect('authentication_required')
      }

      const isAdmin = await isUserAdmin(user.id)
      if (!isAdmin) {
        return createRedirect('insufficient_permissions')
      }
    }

    // Protected user routes
    const protectedPaths = ['/profile', '/orders', '/my-products', '/cart']
    if (protectedPaths.some(path => pathname.startsWith(path))) {
      if (!user) {
        return createRedirect('authentication_required')
      }
    }

    // API routes protection
    if (pathname.startsWith('/api/admin')) {
      if (!user) {
        return new NextResponse('Authentication required', { status: 401 })
      }

      const isAdmin = await isUserAdmin(user.id)
      if (!isAdmin) {
        return new NextResponse('Insufficient permissions', { status: 403 })
      }
    }

  } catch (error) {
    console.error('Middleware error:', error)
    // Continue to allow public routes to work
  }

  return authResponse
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}