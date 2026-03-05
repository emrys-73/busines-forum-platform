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
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">
      <div className="mb-12 reveal">
        <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold tracking-tight mb-3" style={{ letterSpacing: '-0.03em' }}>
          Ökosystem-Graph
        </h1>
        <p className="text-[17px] text-muted-foreground font-normal max-w-2xl">
          Knoten = Community-Mitglieder. Verbindungen = gemeinsame Fähigkeiten oder Interessen. Klicke auf einen Knoten, um das Profil zu sehen.
        </p>
      </div>

      {loading ? (
        <Skeleton className="h-[600px] w-full rounded-xl" />
      ) : graphData ? (
        <EcosystemGraph data={graphData} />
      ) : (
        <div className="text-center py-16 text-muted-foreground">Graph-Daten konnten nicht geladen werden.</div>
      )}
    </div>
  )
}
