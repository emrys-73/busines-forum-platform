interface StatsStripProps {
  memberCount: number
  companyCount: number
  eventCount: number
  postCount: number
}

export function StatsStrip({ memberCount, companyCount, eventCount, postCount }: StatsStripProps) {
  const stats = [
    { label: 'Community Members', value: memberCount, suffix: '+' },
    { label: 'Companies & Startups', value: companyCount, suffix: '' },
    { label: 'Events Hosted', value: eventCount, suffix: '' },
    { label: 'Forum Discussions', value: postCount, suffix: '' },
  ]

  return (
    <section className="py-20 border-y border-border/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-border/50">
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center px-8 reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <div
                className="text-[clamp(2.5rem,6vw,4rem)] font-bold tabular-nums leading-none mb-2"
                style={{ fontFamily: 'var(--font-display), Georgia, serif', letterSpacing: '-0.02em' }}
              >
                {stat.value}{stat.suffix}
              </div>
              <div className="text-[13px] text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
