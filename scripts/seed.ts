/**
 * GLC Business Forum Platform — Database Seed Script
 *
 * Prerequisites:
 *   dotenv is not listed in package.json. Install it before running:
 *     npm install dotenv
 *
 * Run with:
 *   npx tsx scripts/seed.ts
 *
 * Requires the following environment variables in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

// ---------------------------------------------------------------------------
// Supabase client (service role — bypasses RLS)
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    '❌  Missing environment variables.\n' +
      '   Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local'
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// ---------------------------------------------------------------------------
// Helper — throw on Supabase error
// ---------------------------------------------------------------------------

function assertNoError<T>(
  result: { data: T; error: unknown },
  context: string
): T {
  if (result.error) {
    const message =
      result.error instanceof Error
        ? result.error.message
        : JSON.stringify(result.error)
    throw new Error(`[${context}] ${message}`)
  }
  return result.data
}

// ---------------------------------------------------------------------------
// 1. Members
// ---------------------------------------------------------------------------

async function seedMembers(): Promise<string[]> {
  console.log('\n→ Seeding members…')

  const filePath = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    '../data/members.json'
  )

  const raw = fs.readFileSync(filePath, 'utf-8')
  const members: object[] = JSON.parse(raw)

  // Enrich with default flags expected by the schema
  const rows = members.map((m) => ({
    ...m,
    is_admin: false,
    is_visible: true,
  }))

  const data = assertNoError(
    await supabase.from('members').insert(rows).select('id'),
    'seedMembers'
  )

  const ids = (data as { id: string }[]).map((r) => r.id)
  console.log(`   ✓ Inserted ${ids.length} members.`)
  return ids
}

// ---------------------------------------------------------------------------
// 2. Companies
// ---------------------------------------------------------------------------

async function seedCompanies(): Promise<string[]> {
  console.log('\n→ Seeding companies…')

  const companies = [
    {
      name: 'Clara Finance',
      slug: 'clara-finance',
      description:
        'Embedded lending infrastructure for B2B marketplaces. Clara Finance enables platforms to offer working-capital financing to their merchant base without managing credit risk in-house.',
      logo_url: null,
      website_url: 'https://clarafinance.io',
      industry: 'Fintech',
      stage: 'Startup' as const,
      founded_year: 2023,
    },
    {
      name: 'RenewTech',
      slug: 'renewtech',
      description:
        'Energy-management SaaS helping German manufacturing SMEs reduce carbon footprint and energy costs through real-time monitoring, forecasting, and automated optimisation.',
      logo_url: null,
      website_url: 'https://renewtech.eu',
      industry: 'Climate Tech',
      stage: 'Startup' as const,
      founded_year: 2022,
    },
  ]

  const data = assertNoError(
    await supabase.from('companies').insert(companies).select('id'),
    'seedCompanies'
  )

  const ids = (data as { id: string }[]).map((r) => r.id)
  console.log(`   ✓ Inserted ${ids.length} companies.`)
  return ids
}

// ---------------------------------------------------------------------------
// 3. Events
// ---------------------------------------------------------------------------

async function seedEvents(): Promise<void> {
  console.log('\n→ Seeding events…')

  const events = [
    // --- Upcoming event ---
    {
      title: 'GLC Business Forum Platform — March 2026',
      slug: 'glc-munich-business-forum-march-2026',
      description:
        'Join the Gospel Life Center Munich community for our monthly business forum. This edition features a fireside chat on faith-driven leadership in the AI era, open networking, and a pitch spotlight from two early-stage founders in our community. All are welcome — members and guests alike.',
      event_date: '2026-03-05T19:00:00+01:00',
      location: 'Am Kiesgrund 2-4, Feldkirchen',
      is_upcoming: true,
      recap_body: null,
      recap_images: [],
    },

    // --- Past event with recap ---
    {
      title: 'GLC Business Forum Platform — January 2026',
      slug: 'glc-munich-business-forum-january-2026',
      description:
        'Our first forum of the year brought together founders, investors, and advisors for an evening of connection and conversation around the theme "Faithful Execution".',
      event_date: '2026-01-15T18:00:00+01:00',
      location: 'Gospel Life Center Munich, Ridlerstraße 57, 80339 München',
      is_upcoming: false,
      recap_body: `## January Forum Recap — "Faithful Execution"

What a night! Over 40 members and guests gathered at GLC Munich for our January Business Forum, and the energy in the room was extraordinary.

### Highlights

**Fireside Chat: Markus Freiberg & Leah Osei**
Markus and Leah led a candid conversation on what it actually looks like to pursue excellence as a business leader without losing your soul in the process. Key takeaways:
- Integrity is a moat. Companies that cut ethical corners may win quarters but rarely win decades.
- Rest is strategic. Both speakers agreed that sustainable performance is built on sabbath rhythms, not hustle culture.
- Community de-risks everything. Neither would have made their biggest moves without a trusted circle around them.

**Pitch Spotlight**
Two community members shared five-minute pitches and received live feedback from the room:
- **Jonas Becker** (Clara Finance) — demonstrated the embedded lending dashboard and shared early traction metrics from three pilot marketplace clients.
- **Philipp Steiner** (RenewTech) — walked through a live demo of the energy monitoring platform and shared a case study from a Bavarian mid-size manufacturer that reduced energy costs by 18%.

**Networking**
The evening closed with dinner and open networking. Multiple members reported meaningful connections made — including two that have already led to follow-up co-founder conversations.

### What's Next

Our next forum is **5 March 2026**. The theme will be *"AI, Agency, and the Faithful Founder"*. Register above — spots are limited.

*"Whatever you do, work heartily, as for the Lord and not for men." — Colossians 3:23*`,
      recap_images: [],
    },
  ]

  assertNoError(
    await supabase.from('events').insert(events).select('id'),
    'seedEvents'
  )

  console.log(`   ✓ Inserted ${events.length} events.`)
}

// ---------------------------------------------------------------------------
// 4. Company–member links
// ---------------------------------------------------------------------------

async function seedCompanyMembers(
  memberIds: string[],
  companyIds: string[]
): Promise<void> {
  console.log('\n→ Seeding company_members…')

  if (memberIds.length < 3 || companyIds.length < 2) {
    console.warn(
      '   ⚠ Not enough member or company IDs to create company_members — skipping.'
    )
    return
  }

  // Clara Finance: Jonas Becker (index 2) as Founder, Markus Freiberg (index 0) as Advisor
  // RenewTech: Philipp Steiner (index 10) as Founder, Tobias Schreiber (index 6) as Advisor
  const records = [
    {
      company_id: companyIds[0], // Clara Finance
      member_id: memberIds[2],   // Jonas Becker
      role: 'Founder' as const,
      is_primary: true,
    },
    {
      company_id: companyIds[0], // Clara Finance
      member_id: memberIds[0],   // Markus Freiberg
      role: 'Advisor' as const,
      is_primary: false,
    },
    {
      company_id: companyIds[1], // RenewTech
      member_id: memberIds[10],  // Philipp Steiner
      role: 'Founder' as const,
      is_primary: true,
    },
    {
      company_id: companyIds[1], // RenewTech
      member_id: memberIds[6],   // Tobias Schreiber
      role: 'Advisor' as const,
      is_primary: false,
    },
  ]

  assertNoError(
    await supabase.from('company_members').insert(records).select('id'),
    'seedCompanyMembers'
  )

  console.log(`   ✓ Inserted ${records.length} company_member records.`)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('🌱  GLC Business Forum Platform — Seed Script')
  console.log('===========================================')

  try {
    const memberIds = await seedMembers()
    const companyIds = await seedCompanies()
    await seedEvents()
    await seedCompanyMembers(memberIds, companyIds)

    console.log('\n✅  Seed complete.\n')
  } catch (err) {
    console.error('\n❌  Seed failed:', err instanceof Error ? err.message : err)
    process.exit(1)
  }
}

main()
