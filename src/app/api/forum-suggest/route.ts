import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAnthropicClient } from '@/lib/anthropic'
import { serializeMembers, forumSuggestPrompt } from '@/lib/ai-prompts'
import { Member } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const postId = request.nextUrl.searchParams.get('postId')
    if (!postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 })
    }

    const supabase = await createClient()

    const [{ data: post }, { data: members }] = await Promise.all([
      supabase.from('forum_posts').select('title, body').eq('id', postId).single(),
      supabase.from('members').select('*').eq('is_visible', true),
    ])

    if (!post) return NextResponse.json({ suggestions: [] })

    const membersContext = serializeMembers((members as Member[]) || [])
    const anthropic = getAnthropicClient()

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [
        { role: 'user', content: forumSuggestPrompt(post.title, post.body, membersContext) },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : '[]'
    const suggestions = JSON.parse(text)

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Forum suggest error:', error)
    return NextResponse.json({ suggestions: [] })
  }
}
