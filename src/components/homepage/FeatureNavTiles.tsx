import Link from 'next/link'
import { Users, Building2, Calendar, MessageSquare, Zap, Network, BarChart3, Bot } from 'lucide-react'

const features = [
  {
    title: 'Member Directory',
    description: 'Browse all community members, their skills, and what they\'re building.',
    href: '/members',
    icon: Users,
    span: 'col-span-1 row-span-1',
    accent: 'from-blue-500/10 to-indigo-500/5',
    iconColor: 'text-blue-500',
  },
  {
    title: 'Who Can Help Me?',
    description: 'Describe what you need. Our AI scans every member and surfaces the exact right people — with relevance scores and intro email drafts.',
    href: '/tools/matchmaker',
    icon: Zap,
    span: 'col-span-1 md:col-span-2 row-span-1 md:row-span-2',
    accent: 'from-amber-500/10 to-orange-500/5',
    iconColor: 'text-amber-500',
    large: true,
  },
  {
    title: 'Company Showcase',
    description: 'Discover startups and companies founded by our community.',
    href: '/companies',
    icon: Building2,
    span: 'col-span-1 row-span-1',
    accent: 'from-emerald-500/10 to-teal-500/5',
    iconColor: 'text-emerald-500',
  },
  {
    title: 'Community Chat',
    description: 'Chat with an AI that knows every member by name.',
    href: '/tools/chat',
    icon: Bot,
    span: 'col-span-1 row-span-1',
    accent: 'from-purple-500/10 to-violet-500/5',
    iconColor: 'text-purple-500',
  },
  {
    title: 'Events',
    description: 'Monthly forums bringing together Munich\'s faith-driven entrepreneurs.',
    href: '/events',
    icon: Calendar,
    span: 'col-span-1 row-span-1',
    accent: 'from-rose-500/10 to-pink-500/5',
    iconColor: 'text-rose-500',
  },
  {
    title: 'Forum',
    description: 'Ask questions, share insights, get AI-suggested answers.',
    href: '/forum',
    icon: MessageSquare,
    span: 'col-span-1 row-span-1',
    accent: 'from-cyan-500/10 to-sky-500/5',
    iconColor: 'text-cyan-500',
  },
  {
    title: 'Ecosystem Graph',
    description: 'Visual force graph showing how skills and interests connect every member.',
    href: '/tools/ecosystem-graph',
    icon: Network,
    span: 'col-span-1 md:col-span-2 row-span-1',
    accent: 'from-indigo-500/10 to-blue-500/5',
    iconColor: 'text-indigo-500',
  },
  {
    title: 'Analytics',
    description: 'Data insights about our growing community.',
    href: '/tools/analytics',
    icon: BarChart3,
    span: 'col-span-1 row-span-1',
    accent: 'from-violet-500/10 to-purple-500/5',
    iconColor: 'text-violet-500',
  },
]

export function FeatureNavTiles() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <h2
            className="text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight leading-tight mb-4"
            style={{ letterSpacing: '-0.03em' }}
          >
            Everything you need.
          </h2>
          <p className="text-[17px] text-muted-foreground font-light max-w-xl mx-auto">
            A complete suite of tools and community features — all in one place.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[160px] gap-3">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <Link
                key={feature.href}
                href={feature.href}
                className={`${feature.span} group relative rounded-3xl border border-border/60 bg-gradient-to-br ${feature.accent} p-6 overflow-hidden bento-card cursor-pointer flex flex-col justify-between`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Background hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-background/50 to-transparent rounded-3xl" />

                <div className="relative z-10">
                  <div className={`w-10 h-10 rounded-2xl bg-background/80 backdrop-blur flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-5 w-5 ${feature.iconColor}`} />
                  </div>
                  <h3 className={`font-semibold text-foreground leading-tight ${feature.large ? 'text-xl md:text-2xl' : 'text-[15px]'}`}>
                    {feature.title}
                  </h3>
                </div>

                <p className={`relative z-10 text-muted-foreground leading-relaxed ${feature.large ? 'text-[15px] max-w-xs' : 'text-[13px] line-clamp-2'}`}>
                  {feature.description}
                </p>

                {/* Arrow */}
                <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-muted-foreground">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
