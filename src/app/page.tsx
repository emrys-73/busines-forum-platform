import { HeroSection } from '@/components/homepage/HeroSection'
import { StatsStrip } from '@/components/homepage/StatsStrip'
import { NextEventHero } from '@/components/events/NextEventHero'
import { FeatureNavTiles } from '@/components/homepage/FeatureNavTiles'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  const [
    { count: memberCount },
    { count: companyCount },
  ] = await Promise.all([
    supabase.from('members').select('*', { count: 'exact', head: true }).eq('is_visible', true),
    supabase.from('companies').select('*', { count: 'exact', head: true }),
  ])

  return (
    <>
      <HeroSection />
      <StatsStrip
        memberCount={memberCount || 0}
        companyCount={companyCount || 0}
      />
      <div className="max-w-6xl mx-auto px-6 mt-12">
        <NextEventHero />
      </div>
      <FeatureNavTiles />
    </>
  )
}
