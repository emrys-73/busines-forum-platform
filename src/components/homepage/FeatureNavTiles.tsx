'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, Users, Sparkles, Building2, MessageCircle, Network, BarChart3 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'

type Accent = 'teal' | 'blue' | 'purple'

const accentIconBg: Record<Accent, string> = {
  teal: 'bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-400',
  blue: 'bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400',
  purple: 'bg-purple-500/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400',
}

const accentCategoryClass: Record<Accent, string> = {
  teal: 'text-teal-600/70 dark:text-teal-400/70',
  blue: 'text-blue-600/70 dark:text-blue-400/70',
  purple: 'text-purple-600/70 dark:text-purple-400/70',
}

export function FeatureNavTiles() {
  const { t } = useTranslation()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const features: {
    category: string
    title: string
    description: string
    href: string
    accent: Accent
    icon: React.ElementType
  }[] = [
    {
      category: t('features.category.community'),
      title: t('features.memberDirectory.title'),
      description: t('features.memberDirectory.desc'),
      href: '/members',
      accent: 'teal',
      icon: Users,
    },
    {
      category: t('features.category.ai'),
      title: t('features.matchmaker.title'),
      description: t('features.matchmaker.desc'),
      href: '/tools/matchmaker',
      accent: 'blue',
      icon: Sparkles,
    },
    {
      category: t('features.category.startups'),
      title: t('features.companies.title'),
      description: t('features.companies.desc'),
      href: '/companies',
      accent: 'purple',
      icon: Building2,
    },
    {
      category: t('features.category.ai'),
      title: t('features.chat.title'),
      description: t('features.chat.desc'),
      href: '/tools/chat',
      accent: 'teal',
      icon: MessageCircle,
    },
    {
      category: t('features.category.visualisation'),
      title: t('features.graph.title'),
      description: t('features.graph.desc'),
      href: '/tools/ecosystem-graph',
      accent: 'teal',
      icon: Network,
    },
    {
      category: t('features.category.insights'),
      title: t('features.analytics.title'),
      description: t('features.analytics.desc'),
      href: '/tools/analytics',
      accent: 'blue',
      icon: BarChart3,
    },
  ]

  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.querySelector('a')?.offsetWidth || 340
    el.scrollBy({ left: direction === 'left' ? -cardWidth - 16 : cardWidth + 16, behavior: 'smooth' })
  }

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header row */}
        <div className="flex items-end justify-between mb-10 reveal">
          <div>
            <h2
              className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight"
              style={{ fontFamily: 'var(--font-display), Georgia, serif', letterSpacing: '-0.01em' }}
            >
              {t('features.heading')}
            </h2>
            <p className="text-lg text-muted-foreground font-normal mt-2 max-w-md">
              {t('features.subheading')}
            </p>
          </div>

          {/* Navigation arrows */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="h-10 w-10 rounded-full border border-border/60 bg-background flex items-center justify-center transition-all duration-200 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="h-10 w-10 rounded-full border border-border/60 bg-background flex items-center justify-center transition-all duration-200 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Fade edges */}
          {canScrollLeft && (
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          )}
          {canScrollRight && (
            <div className="hidden md:block absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          )}

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className="group flex-shrink-0 snap-start w-[300px] sm:w-[340px] rounded-2xl bg-muted/40 dark:bg-muted/20 border border-border/40 p-6 flex flex-col gap-4 transition-all duration-300 hover:bg-muted/70 dark:hover:bg-muted/40 hover:border-border/60 hover:shadow-lg"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Category */}
                  <span className={`text-xs font-semibold uppercase tracking-widest ${accentCategoryClass[feature.accent]}`}>
                    {feature.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground leading-snug">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[15px] text-muted-foreground leading-relaxed flex-1">
                    {feature.description}
                  </p>

                  {/* Icon area */}
                  <div className="mt-2 flex items-center justify-between">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${accentIconBg[feature.accent]}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="h-9 w-9 rounded-full bg-foreground/5 dark:bg-foreground/10 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-200">
                      <ArrowRight className="h-4 w-4 text-foreground/60" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
