import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Users, Building2, Calendar, MessageSquare, Zap, Network, BarChart3, Bot } from 'lucide-react'

const features = [
  {
    title: 'Member Directory',
    description: 'Browse all community members, their skills, and what they\'re building.',
    href: '/members',
    icon: Users,
  },
  {
    title: 'Company Showcase',
    description: 'Discover startups and companies founded by our community.',
    href: '/companies',
    icon: Building2,
  },
  {
    title: 'Events',
    description: 'Stay up to date with upcoming and past forum events.',
    href: '/events',
    icon: Calendar,
  },
  {
    title: 'Forum',
    description: 'Ask questions, share insights, and learn from the community.',
    href: '/forum',
    icon: MessageSquare,
  },
  {
    title: 'Who Can Help Me?',
    description: 'AI-powered matchmaking to find exactly who you need.',
    href: '/tools/matchmaker',
    icon: Zap,
  },
  {
    title: 'Community Chat',
    description: 'Chat with an AI that knows every member of the community.',
    href: '/tools/chat',
    icon: Bot,
  },
  {
    title: 'Ecosystem Graph',
    description: 'Visual map of how skills and interests connect members.',
    href: '/tools/ecosystem-graph',
    icon: Network,
  },
  {
    title: 'Analytics',
    description: 'Data insights about our growing community.',
    href: '/tools/analytics',
    icon: BarChart3,
  },
]

export function FeatureNavTiles() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-2 text-center">Everything You Need</h2>
        <p className="text-muted-foreground text-center mb-10">Tools and features designed for our community</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Link key={feature.href} href={feature.href}>
                <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                  <CardHeader className="pb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
