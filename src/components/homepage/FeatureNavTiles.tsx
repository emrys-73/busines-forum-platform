import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const features = [
  {
    category: 'Community',
    title: 'Member Directory',
    description: 'Browse all community members, their skills, and what they\'re building.',
    href: '/members',
    span: 'col-span-1',
  },
  {
    category: 'AI',
    title: 'Who Can Help Me?',
    description: 'Describe what you need. Our AI scans every member and surfaces the exact right people — with relevance scores and intro email drafts.',
    href: '/tools/matchmaker',
    span: 'col-span-1 md:col-span-2',
    featured: true,
  },
  {
    category: 'Startups',
    title: 'Company Showcase',
    description: 'Discover startups and companies founded by our community.',
    href: '/companies',
    span: 'col-span-1',
  },
  {
    category: 'AI',
    title: 'Community Chat',
    description: 'Chat with an AI that knows every member by name.',
    href: '/tools/chat',
    span: 'col-span-1',
  },
  {
    category: 'Events',
    title: 'Monthly Forums',
    description: 'Monthly forums bringing together Munich\'s faith-driven entrepreneurs.',
    href: '/events',
    span: 'col-span-1',
  },
  {
    category: 'Discussions',
    title: 'Forum',
    description: 'Ask questions, share insights, get AI-suggested answers.',
    href: '/forum',
    span: 'col-span-1',
  },
  {
    category: 'Visualisation',
    title: 'Ecosystem Graph',
    description: 'Visual force graph showing how skills and interests connect every member.',
    href: '/tools/ecosystem-graph',
    span: 'col-span-1 md:col-span-2',
  },
  {
    category: 'Insights',
    title: 'Analytics',
    description: 'Data insights about our growing community.',
    href: '/tools/analytics',
    span: 'col-span-1',
  },
]

export function FeatureNavTiles() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <h2
            className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight mb-4"
            style={{ fontFamily: 'var(--font-display), Georgia, serif', letterSpacing: '-0.01em' }}
          >
            Everything you need.
          </h2>
          <p className="text-[17px] text-muted-foreground font-light max-w-xl mx-auto">
            A complete suite of tools and community features — all in one place.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border/40 rounded-3xl overflow-hidden border border-border/40">
          {features.map((feature, i) => (
            <Link
              key={feature.href}
              href={feature.href}
              className={`${feature.span} group relative bg-background hover:bg-muted/40 transition-colors duration-300 p-7 flex flex-col gap-3 cursor-pointer`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Category label */}
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                {feature.category}
              </span>

              {/* Title */}
              <h3 className={`font-semibold text-foreground leading-snug ${feature.featured ? 'text-[1.35rem]' : 'text-[1rem]'}`}>
                {feature.title}
              </h3>

              {/* Description */}
              <p className={`text-muted-foreground leading-relaxed ${feature.featured ? 'text-[15px]' : 'text-[13px]'}`}>
                {feature.description}
              </p>

              {/* Arrow */}
              <div className="mt-auto pt-2 flex items-center gap-1 text-[13px] font-medium text-foreground/60 group-hover:text-foreground transition-colors duration-200">
                <span>Learn more</span>
                <ArrowRight className="h-3.5 w-3.5 translate-x-0 group-hover:translate-x-0.5 transition-transform duration-200" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
