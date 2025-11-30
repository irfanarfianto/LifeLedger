import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // Debug logging
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  console.log('Callback Cookies:', allCookies.map(c => c.name).join(', '))
  
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/'
  
  // Ensure next is a relative URL for security
  if (!next.startsWith('/')) {
    next = '/'
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    } else {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent(error.message)}`)
    }
  }

  // return the user to an error page with instructions
  const errorCode = searchParams.get('error')
  const errorDesc = searchParams.get('error_description')
  
  if (errorCode) {
    return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent(errorCode)}&error_description=${encodeURIComponent(errorDesc || '')}`)
  }

  return NextResponse.redirect(`${origin}/auth/error?error=NoCodeProvided`)
}
