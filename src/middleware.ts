import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('arena_pro_access_token')
  const isAuthPage = request.nextUrl.pathname.startsWith('/login')

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        credentials: 'include',
        headers: {
          Cookie: `arena_pro_access_token=${token.value}`,
        }
      })

      if (!response.ok && !isAuthPage) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            Cookie: `arena_pro_access_token=${token.value}`,
          }
        })
        return NextResponse.redirect(new URL('/login', request.url))
      }

      if (response.ok && isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (error) {
      if (!isAuthPage) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 