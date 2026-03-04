import { HeroSection } from '@/components/homepage/HeroSection'
import { StatsStrip } from '@/components/homepage/StatsStrip'
import { FeatureNavTiles } from '@/components/homepage/FeatureNavTiles'
import { NextEventHero } from '@/components/events/NextEventHero'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  const [
    { count: memberCount },
    { count: companyCount },
    { count: eventCount },
    { count: postCount },
  ] = await Promise.all([
    supabase.from('members').select('*', { count: 'exact', head: true }).eq('is_visible', true),
    supabase.from('companies').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('forum_posts').select('*', { count: 'exact', head: true }),
  ])

  return (
    <>
      <HeroSection />
      <StatsStrip
        memberCount={memberCount || 0}
        companyCount={companyCount || 0}
        eventCount={eventCount || 0}
        postCount={postCount || 0}
      />
      <div className="container mx-auto px-4 py-12">
        <NextEventHero />
      </div>
      <FeatureNavTiles />
    </>
  )
}
