import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-12 pb-24 overflow-hidden">
      {/* Subtle radial gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,0,0,0.04) 0%, transparent 70%)',
        }}
      />
      <div className="dark:block hidden absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,255,255,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-5xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <div className="animate-fade-in opacity-0-init mb-6">
          <span className="inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            GLC Munich · Business Forum
          </span>
        </div>

        {/* Main headline */}
        <h1
          className="animate-fade-in-up opacity-0-init delay-100 text-[clamp(2.8rem,8vw,6rem)] font-bold leading-[1.05] mb-6"
          style={{ fontFamily: 'var(--font-display), Georgia, serif', letterSpacing: '-0.01em' }}
        >
          Where faith meets
          <br />
          <span className="text-gradient">entrepreneurship.</span>
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-in-up opacity-0-init delay-200 text-[clamp(1rem,2.5vw,1.375rem)] text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Connect with founders, investors, and startup-minded people
          building the future in Munich — powered by AI.
        </p>

        {/* CTAs */}
        <div className="animate-fade-in-up opacity-0-init delay-300 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 h-12 text-[15px] font-medium bg-foreground text-background hover:opacity-80 transition-opacity"
          >
            <Link href="/members">
              Explore Community
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full px-8 h-12 text-[15px] font-medium border-border/60 hover:bg-accent transition-colors"
          >
            <Link href="/tools/matchmaker">
              Find Connections
            </Link>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="animate-fade-in opacity-0-init delay-700 absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-border to-transparent" />
      </div>
    </section>
  )
}
