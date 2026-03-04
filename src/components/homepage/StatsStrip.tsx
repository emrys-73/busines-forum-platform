interface StatsStripProps {
  memberCount: number
  companyCount: number
  eventCount: number
  postCount: number
}

export function StatsStrip({ memberCount, companyCount, eventCount, postCount }: StatsStripProps) {
  const stats = [
    { label: 'Community Members', value: memberCount },
    { label: 'Companies & Startups', value: companyCount },
    { label: 'Events Hosted', value: eventCount },
    { label: 'Forum Discussions', value: postCount },
  ]

  return (
    <section className="border-y bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold tabular-nums">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
