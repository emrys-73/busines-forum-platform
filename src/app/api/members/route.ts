import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const limit = Math.min(Number(searchParams.get('limit') || 50), 100)
  const offset = Number(searchParams.get('offset') || 0)
  const search = searchParams.get('search') || ''

  let query = supabase
    .from('members')
    .select('*', { count: 'exact' })
    .eq('is_visible', true)
    .order('joined_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,bio.ilike.%${search}%,job_title.ilike.%${search}%`)
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ members: data, total: count })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Require authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Use service client for DB operations (bypasses RLS)
  const serviceClient = await createServiceClient()

  // Check if member already exists for this user
  const { data: existing } = await serviceClient
    .from('members')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Member already exists for this user' }, { status: 409 })
  }

  const body = await request.json()

  const { data, error } = await serviceClient
    .from('members')
    .insert({
      user_id: user.id,
      email: user.email!,
      name: body.name || user.user_metadata?.name || user.email!.split('@')[0],
      bio: body.bio || null,
      tagline: body.tagline || null,
      job_title: body.job_title || null,
      linkedin_url: body.linkedin_url || null,
      website_url: body.website_url || null,
      skills: body.skills || [],
      interests: body.interests || [],
      tags: body.tags || [],
      looking_for: body.looking_for || null,
      can_help_with: body.can_help_with || null,
      is_admin: false,
      is_visible: true,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ member: data }, { status: 201 })
}
