import { Member } from '@/types'

export interface GraphNode {
  id: string
  name: string
  val: number
  group: number
  color?: string
  member: Member
}

export interface GraphLink {
  source: string
  target: string
  value: number
}

export interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}

const GROUP_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
  '#10b981', '#3b82f6', '#ef4444', '#14b8a6',
]

function jaccardSimilarity(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 0
  const setA = new Set(a)
  const setB = new Set(b)
  const intersection = [...setA].filter((x) => setB.has(x)).length
  const union = new Set([...setA, ...setB]).size
  return union === 0 ? 0 : intersection / union
}

function sharedCount(a: Member, b: Member): number {
  const skillsA = new Set(a.skills)
  const skillsB = new Set(b.skills)
  const interestsA = new Set(a.interests)
  const interestsB = new Set(b.interests)
  let count = 0
  skillsB.forEach((s) => { if (skillsA.has(s)) count++ })
  interestsB.forEach((i) => { if (interestsA.has(i)) count++ })
  return count
}

export function buildGraphData(members: Member[]): GraphData {
  const links: GraphLink[] = []
  const degreeMap: Map<string, number> = new Map()

  members.forEach((m) => degreeMap.set(m.id, 0))

  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const shared = sharedCount(members[i], members[j])
      if (shared >= 1) {
        links.push({ source: members[i].id, target: members[j].id, value: shared })
        degreeMap.set(members[i].id, (degreeMap.get(members[i].id) || 0) + 1)
        degreeMap.set(members[j].id, (degreeMap.get(members[j].id) || 0) + 1)
      }
    }
  }

  // Simple group assignment via Jaccard similarity clustering
  const groups: Map<string, number> = new Map()
  let nextGroup = 0

  members.forEach((member) => {
    if (groups.has(member.id)) return
    groups.set(member.id, nextGroup)
    const combined = [...member.skills, ...member.interests]
    members.forEach((other) => {
      if (other.id === member.id || groups.has(other.id)) return
      const otherCombined = [...other.skills, ...other.interests]
      const similarity = jaccardSimilarity(combined, otherCombined)
      if (similarity >= 0.2) {
        groups.set(other.id, nextGroup)
      }
    })
    nextGroup++
  })

  const nodes: GraphNode[] = members.map((m) => ({
    id: m.id,
    name: m.name,
    val: Math.max(4, (degreeMap.get(m.id) || 0) * 2 + 4),
    group: groups.get(m.id) || 0,
    color: GROUP_COLORS[(groups.get(m.id) || 0) % GROUP_COLORS.length],
    member: m,
  }))

  return { nodes, links }
}
