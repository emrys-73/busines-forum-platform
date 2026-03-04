import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAnthropicClient } from '@/lib/anthropic'
import { serializeMembers, introduceMePrompt } from '@/lib/ai-prompts'
import { Member } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { targetId, targetName, reason, requesterId, requesterName } = await request.json()

    if (!targetId || !reason?.trim()) {
      return NextResponse.json({ error: 'Target and reason are required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let rId = requesterId
    let rName = requesterName

    if (user && !rId) {
      const { data: member } = await supabase
        .from('members')
        .select('id, name')
        .eq('user_id', user.id)
        .single()
      if (member) {
        rId = member.id
        rName = member.name
      }
    }

    if (!rId) {
      rId = 'anonymous'
      rName = 'A Community Member'
    }

    const { data: members } = await supabase
      .from('members')
      .select('*')
      .eq('is_visible', true)

    const membersContext = serializeMembers((members as Member[]) || [])
    const anthropic = getAnthropicClient()

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [
        { role: 'user', content: introduceMePrompt(rId, rName, targetId, targetName, reason, membersContext) },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : '{}'
    const draft = JSON.parse(text)

    return NextResponse.json(draft)
  } catch (error) {
    console.error('Introduce me error:', error)
    return NextResponse.json({ error: 'Failed to generate introduction' }, { status: 500 })
  }
}
