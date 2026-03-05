import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/analytics/StatCard'
import { SkillDistributionChart } from '@/components/analytics/SkillDistributionChart'
import { MemberGrowthChart } from '@/components/analytics/MemberGrowthChart'
import { TopCompaniesChart } from '@/components/analytics/TopCompaniesChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Member, Company } from '@/types'
import { Users, Building2 } from 'lucide-react'
import { format, subMonths } from 'date-fns'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Analytics' }

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const [
    { data: members },
    { data: companies },
    { data: companyMembers },
  ] = await Promise.all([
    supabase.from('members').select('*').eq('is_visible', true),
    supabase.from('companies').select('*'),
    supabase.from('company_members').select('company_id, company:companies(name)'),
  ])

  const memberList = (members as Member[]) || []
  const companyList = (companies as Company[]) || []

  // Skill distribution
  const skillMap = new Map<string, number>()
  memberList.forEach((m) => {
    m.skills.forEach((s) => skillMap.set(s, (skillMap.get(s) || 0) + 1))
  })
  const skillData = [...skillMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([skill, count]) => ({ skill, count }))

  // Member growth (cumulative over last 8 months)
  const growthData = []
  for (let i = 7; i >= 0; i--) {
    const month = subMonths(new Date(), i)
    const cutoff = month.toISOString()
    const count = memberList.filter((m) => m.joined_at <= cutoff).length
    growthData.push({ month: format(month, 'MMM yy'), count })
  }

  // Top companies by member count
  const companyMemberMap = new Map<string, number>()
  const companyNameMap = new Map<string, string>()
  ;(companyMembers || []).forEach((cm: Record<string, unknown>) => {
    const cid = cm.company_id as string
    const cname = (cm.company as { name: string } | null)?.name || 'Unknown'
    companyMemberMap.set(cid, (companyMemberMap.get(cid) || 0) + 1)
    companyNameMap.set(cid, cname)
  })
  const topCompanies = [...companyMemberMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([id, members]) => ({ name: companyNameMap.get(id) || 'Unknown', members }))

  // Tag distribution
  const tagMap = new Map<string, number>()
  memberList.forEach((m) => {
    m.tags.forEach((t) => tagMap.set(t, (tagMap.get(t) || 0) + 1))
  })

  return (
    <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
      <div className="mb-12 reveal">
        <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold tracking-tight mb-3" style={{ letterSpacing: '-0.03em' }}>
          Community-Analyse
        </h1>
        <p className="text-xl text-muted-foreground font-normal max-w-2xl">
          Daten-Einblicke über unsere wachsende Community.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard title="Mitglieder" value={memberList.length} icon={Users} description="Aktive sichtbare Mitglieder" />
        <StatCard title="Unternehmen" value={companyList.length} icon={Building2} description="Startups & Unternehmen" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mitglieder-Wachstum</CardTitle>
          </CardHeader>
          <CardContent>
            <MemberGrowthChart data={growthData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Unternehmen nach Teamgröße</CardTitle>
          </CardHeader>
          <CardContent>
            {topCompanies.length > 0 ? (
              <TopCompaniesChart data={topCompanies} />
            ) : (
              <div className="text-base text-muted-foreground py-8 text-center">Noch keine Unternehmensdaten</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Fähigkeiten in der Community</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillDistributionChart data={skillData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mitglieder-Typen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 pt-2">
              {[...tagMap.entries()].sort((a, b) => b[1] - a[1]).map(([tag, count]) => (
                <div key={tag} className="flex items-center gap-3">
                  <span className="text-base capitalize w-24 flex-shrink-0">{tag}</span>
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 bg-primary rounded-full"
                      style={{ width: `${(count / memberList.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
