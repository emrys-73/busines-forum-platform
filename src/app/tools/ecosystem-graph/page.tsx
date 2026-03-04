'use client'

import { useEffect, useState } from 'react'
import { EcosystemGraph } from '@/components/tools/EcosystemGraph'
import { GraphData } from '@/lib/graph-utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Network } from 'lucide-react'

export default function EcosystemGraphPage() {
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/graph-data')
      .then((r) => r.json())
      .then((d) => {
        setGraphData(d.graph)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Network className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Ecosystem Graph</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Nodes = community members. Edges = shared skills or interests. Click any node to see their profile.
        </p>
      </div>

      {loading ? (
        <Skeleton className="h-[600px] w-full rounded-xl" />
      ) : graphData ? (
        <EcosystemGraph data={graphData} />
      ) : (
        <div className="text-center py-16 text-muted-foreground">Failed to load graph data.</div>
      )}
    </div>
  )
}
