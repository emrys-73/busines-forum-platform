import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAnthropicClient } from '@/lib/anthropic'
import { serializeMembers, matchmakerPrompt } from '@/lib/ai-prompts'
import { Member } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { need } = await request.json()
    if (!need?.trim()) {
      return NextResponse.json({ error: 'Need is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: members } = await supabase
      .from('members')
      .select('*')
      .eq('is_visible', true)

    if (!members?.length) {
      return NextResponse.json({ matches: [] })
    }

    const membersContext = serializeMembers(members as Member[])
    const anthropic = getAnthropicClient()

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        { role: 'user', content: matchmakerPrompt(need, membersContext) },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const matches = JSON.parse(text)

    return NextResponse.json({ matches })
  } catch (error) {
    console.error('Matchmaker error:', error)
    return NextResponse.json({ error: 'Failed to find matches' }, { status: 500 })
  }
}
