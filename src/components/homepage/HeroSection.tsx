import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="container mx-auto px-4 text-center">
        <Badge variant="secondary" className="mb-6 gap-1.5">
          <Sparkles className="h-3 w-3" />
          AI-Powered Community Platform
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
          GLC Munich<br />Business Forum
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Where faith meets entrepreneurship. Connect with founders, investors, and startup-minded people building the future in Munich.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/members">
              Explore Members
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/tools/matchmaker">
              Find Connections
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
