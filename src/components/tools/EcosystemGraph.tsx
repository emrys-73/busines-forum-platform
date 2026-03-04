'use client'

import { useCallback, useRef, useState, useEffect } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { GraphData, GraphNode } from '@/lib/graph-utils'
import { ExternalLink } from 'lucide-react'

interface EcosystemGraphProps {
  data: GraphData
}

export function EcosystemGraph({ data }: EcosystemGraphProps) {
  const [ForceGraph, setForceGraph] = useState<React.ComponentType<Record<string, unknown>> | null>(null)
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    import('react-force-graph-2d').then((m) => setForceGraph(() => m.default as React.ComponentType<Record<string, unknown>>))
  }, [])

  useEffect(() => {
    function update() {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: Math.max(500, window.innerHeight - 200),
        })
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const handleNodeClick = useCallback((node: Record<string, unknown>) => {
    setSelectedNode(node as unknown as GraphNode)
  }, [])

  const nodeCanvasObject = useCallback((node: Record<string, unknown>, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const n = node as unknown as GraphNode & { x: number; y: number }
    const label = n.name
    const fontSize = Math.max(10, 12 / globalScale)
    const radius = n.val || 6

    ctx.beginPath()
    ctx.arc(n.x, n.y, radius, 0, 2 * Math.PI)
    ctx.fillStyle = n.color || '#6366f1'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    if (globalScale >= 1.5 || (globalScale >= 0.8 && radius > 8)) {
      ctx.font = `${fontSize}px Helvetica Neue, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillStyle = 'rgba(0,0,0,0.8)'
      ctx.fillText(label, n.x, n.y + radius + 2)
    }
  }, [])

  if (!ForceGraph) {
    return (
      <div className="flex items-center justify-center h-[500px] border rounded-xl bg-muted/30">
        <div className="text-center space-y-3">
          <Skeleton className="h-8 w-8 rounded-full mx-auto" />
          <p className="text-sm text-muted-foreground">Loading graph...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="border rounded-xl overflow-hidden bg-muted/10"
        style={{ height: dimensions.height }}
      >
        <ForceGraph
          graphData={data as unknown as Record<string, unknown>}
          width={dimensions.width}
          height={dimensions.height}
          nodeCanvasObject={nodeCanvasObject}
          nodeCanvasObjectMode={() => 'replace'}
          linkWidth={(link: Record<string, unknown>) => Math.sqrt((link.value as number) || 1)}
          linkColor={() => 'rgba(100,100,100,0.15)'}
          onNodeClick={handleNodeClick}
          nodeLabel={(node: Record<string, unknown>) => (node as unknown as GraphNode).name}
          backgroundColor="transparent"
          cooldownTicks={100}
        />
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
                    <p className="text-sm text-muted-foreground">{selectedNode.member.job_title}</p>
                  )}
                </div>
              </div>
              {selectedNode.member.tagline && (
                <p className="text-sm italic text-muted-foreground">&ldquo;{selectedNode.member.tagline}&rdquo;</p>
              )}
              {selectedNode.member.bio && (
                <p className="text-sm">{selectedNode.member.bio}</p>
              )}
              {selectedNode.member.skills.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.member.skills.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <Button asChild size="sm" className="w-full gap-2">
                <Link href={`/members/${selectedNode.member.id}`}>
                  View Full Profile
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <div className="mt-3 text-xs text-muted-foreground text-center">
        Click a node to see member details. Edge thickness = shared skills/interests.
      </div>
    </div>
  )
}
