import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code)

    // Auto-create member record if one doesn't exist yet
    if (session?.user) {
      const user = session.user
      const serviceClient = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          cookies: {
            getAll() { return cookieStore.getAll() },
            setAll() {},
          },
        }
      )

      const { data: existing } = await serviceClient
        .from('members')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!existing) {
        await serviceClient.from('members').insert({
          user_id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email!.split('@')[0],
          skills: [],
          interests: [],
          tags: [],
          is_admin: false,
          is_visible: true,
        })
      }
    }
  }

  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
}
