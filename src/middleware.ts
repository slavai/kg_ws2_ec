import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
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
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  await supabase.auth.getUser()

  // Protected admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      const redirectUrl = new URL('/', request.url)
      redirectUrl.searchParams.set('redirected', 'true')
      redirectUrl.searchParams.set('message', 'Требуется авторизация')
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user is admin
    const { data: userProfile } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!userProfile?.is_admin) {
      const redirectUrl = new URL('/', request.url)
      redirectUrl.searchParams.set('redirected', 'true')
      redirectUrl.searchParams.set('message', 'Недостаточно прав доступа')
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Protected user routes
  const protectedPaths = ['/profile', '/orders', '/my-products', '/cart']
  if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      const redirectUrl = new URL('/', request.url)
      redirectUrl.searchParams.set('redirected', 'true')
      redirectUrl.searchParams.set('message', 'Требуется авторизация')
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}