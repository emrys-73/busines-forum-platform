import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildGraphData } from '@/lib/graph-utils'
import { Member } from '@/types'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: members } = await supabase
      .from('members')
      .select('*')
      .eq('is_visible', true)

    const memberList = (members as Member[]) || []
    const graph = buildGraphData(memberList)

    return NextResponse.json({ graph, members: memberList })
  } catch (error) {
    console.error('Graph data error:', error)
    return NextResponse.json({ error: 'Failed to fetch graph data' }, { status: 500 })
  }
}
