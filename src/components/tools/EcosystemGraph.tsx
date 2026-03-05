'use client'

import { useMemo, useState, useRef, useCallback } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { GraphData, GraphNode, GraphLink } from '@/lib/graph-utils'
import { ExternalLink } from 'lucide-react'

interface EcosystemGraphProps {
  data: GraphData
}

interface PositionedNode extends GraphNode {
  x: number
  y: number
}

function layoutNodes(data: GraphData, width: number, height: number): PositionedNode[] {
  const cx = width / 2
  const cy = height / 2
  const groups = new Map<number, GraphNode[]>()

  data.nodes.forEach((n) => {
    const list = groups.get(n.group) || []
    list.push(n)
    groups.set(n.group, list)
  })

  const groupKeys = Array.from(groups.keys())
  const positioned: PositionedNode[] = []
  const groupRadius = Math.min(width, height) * 0.32

  groupKeys.forEach((groupId, gi) => {
    const members = groups.get(groupId)!
    const groupAngle = (2 * Math.PI * gi) / groupKeys.length - Math.PI / 2
    const groupCx = cx + groupRadius * Math.cos(groupAngle)
    const groupCy = cy + groupRadius * Math.sin(groupAngle)
    const memberRadius = Math.min(80, 30 + members.length * 12)

    members.forEach((node, mi) => {
      const angle = (2 * Math.PI * mi) / members.length - Math.PI / 2
      const x = members.length === 1 ? groupCx : groupCx + memberRadius * Math.cos(angle)
      const y = members.length === 1 ? groupCy : groupCy + memberRadius * Math.sin(angle)
      positioned.push({ ...node, x, y })
    })
  })

  return positioned
}

export function EcosystemGraph({ data }: EcosystemGraphProps) {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const width = 900
  const height = 600

  const positioned = useMemo(() => layoutNodes(data, width, height), [data])

  const nodeMap = useMemo(() => {
    const map = new Map<string, PositionedNode>()
    positioned.forEach((n) => map.set(n.id, n))
    return map
  }, [positioned])

  const connectedTo = useMemo(() => {
    const map = new Map<string, Set<string>>()
    data.links.forEach((link) => {
      const s = typeof link.source === 'string' ? link.source : (link.source as unknown as GraphNode).id
      const t = typeof link.target === 'string' ? link.target : (link.target as unknown as GraphNode).id
      if (!map.has(s)) map.set(s, new Set())
      if (!map.has(t)) map.set(t, new Set())
      map.get(s)!.add(t)
      map.get(t)!.add(s)
    })
    return map
  }, [data.links])

  const isHighlighted = useCallback((nodeId: string) => {
    if (!hoveredNode) return true
    if (nodeId === hoveredNode) return true
    return connectedTo.get(hoveredNode)?.has(nodeId) ?? false
  }, [hoveredNode, connectedTo])

  const isLinkHighlighted = useCallback((link: GraphLink) => {
    if (!hoveredNode) return true
    const s = typeof link.source === 'string' ? link.source : (link.source as unknown as GraphNode).id
    const t = typeof link.target === 'string' ? link.target : (link.target as unknown as GraphNode).id
    return s === hoveredNode || t === hoveredNode
  }, [hoveredNode])

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="border rounded-xl overflow-hidden bg-muted/10"
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          style={{ maxHeight: '70vh' }}
        >
          {/* Links */}
          {data.links.map((link, i) => {
            const s = typeof link.source === 'string' ? link.source : (link.source as unknown as GraphNode).id
            const t = typeof link.target === 'string' ? link.target : (link.target as unknown as GraphNode).id
            const source = nodeMap.get(s)
            const target = nodeMap.get(t)
            if (!source || !target) return null
            const highlighted = isLinkHighlighted(link)
            return (
              <line
                key={i}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={highlighted ? 'rgba(120,120,120,0.25)' : 'rgba(120,120,120,0.06)'}
                strokeWidth={Math.max(1, link.value * 1.5)}
                className="transition-opacity duration-200"
              />
            )
          })}

          {/* Nodes */}
          {positioned.map((node) => {
            const highlighted = isHighlighted(node.id)
            const radius = node.val || 6
            return (
              <g
                key={node.id}
                className="cursor-pointer"
                onClick={() => setSelectedNode(node)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ opacity: highlighted ? 1 : 0.15, transition: 'opacity 0.2s' }}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius + 2}
                  fill="transparent"
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius}
                  fill={node.color || '#6366f1'}
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth={1.5}
                />
                <text
                  x={node.x}
                  y={node.y + radius + 14}
                  textAnchor="middle"
                  fontSize={11}
                  fill="currentColor"
                  className="pointer-events-none select-none"
                  opacity={0.8}
                >
                  {node.name.split(' ')[0]}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <Sheet open={!!selectedNode} onOpenChange={(open) => !open && setSelectedNode(null)}>
        <SheetContent className="w-80">
          {selectedNode && (
            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedNode.member.avatar_url || undefined} />
                  <AvatarFallback>{selectedNode.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedNode.member.name}</h3>
                  {selectedNode.member.job_title && (
                    <p className="text-base text-muted-foreground">{selectedNode.member.job_title}</p>
                  )}
                </div>
              </div>
              {selectedNode.member.tagline && (
                <p className="text-base italic text-muted-foreground">&ldquo;{selectedNode.member.tagline}&rdquo;</p>
              )}
              {selectedNode.member.bio && (
                <p className="text-base">{selectedNode.member.bio}</p>
              )}
              {selectedNode.member.skills.length > 0 && (
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.member.skills.map((s) => (
                      <Badge key={s} variant="secondary" className="text-sm">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <Button asChild size="sm" className="w-full gap-2">
                <Link href={`/members/${selectedNode.member.id}`}>
                  View Full Profile
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <div className="mt-3 text-sm text-muted-foreground text-center">
        Click a node to see member details. Hover to highlight connections.
      </div>
    </div>
  )
}
