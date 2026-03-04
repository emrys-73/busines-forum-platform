import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAnthropicClient } from '@/lib/anthropic'
import { serializeMembers, opportunitySpotterPrompt } from '@/lib/ai-prompts'
import { Member } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { context } = await request.json()
    if (!context?.trim()) {
      return NextResponse.json({ error: 'Context is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: members } = await supabase
      .from('members')
      .select('*')
      .eq('is_visible', true)

    const membersContext = serializeMembers((members as Member[]) || [])
    const anthropic = getAnthropicClient()

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        { role: 'user', content: opportunitySpotterPrompt(context, membersContext) },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const opportunities = JSON.parse(text)

    return NextResponse.json({ opportunities })
  } catch (error) {
    console.error('Opportunity spotter error:', error)
    return NextResponse.json({ error: 'Failed to spot opportunities' }, { status: 500 })
  }
}
