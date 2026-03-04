export interface Member {
  id: string
  user_id: string | null
  name: string
  email: string
  avatar_url: string | null
  bio: string | null
  tagline: string | null
  job_title: string | null
  linkedin_url: string | null
  website_url: string | null
  skills: string[]
  interests: string[]
  tags: string[]
  looking_for: string | null
  can_help_with: string | null
  is_admin: boolean
  is_visible: boolean
  joined_at: string
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  website_url: string | null
  industry: string | null
  stage: 'Startup' | 'SME' | 'Enterprise' | 'Freelancer' | null
  founded_year: number | null
  created_at: string
  updated_at: string
}

export interface CompanyMember {
  id: string
  company_id: string
  member_id: string
  role: 'Founder' | 'Co-Founder' | 'Employee' | 'Advisor' | 'Investor'
  is_primary: boolean
  member?: Member
  company?: Company
}

export interface Event {
  id: string
  title: string
  slug: string
  description: string | null
  event_date: string
  location: string | null
  is_upcoming: boolean
  recap_body: string | null
  recap_images: string[]
  created_at: string
}

export interface ForumPost {
  id: string
  author_id: string | null
  title: string
  body: string
  tags: string[]
  is_pinned: boolean
  view_count: number
  created_at: string
  updated_at: string
  author?: Member
  replies?: ForumReply[]
}

export interface ForumReply {
  id: string
  post_id: string
  author_id: string | null
  body: string
  is_ai_suggested: boolean
  created_at: string
  updated_at: string
  author?: Member
}

export type MemberTag = 'founder' | 'investor' | 'advisor' | 'technical' | 'creative' | 'operator' | 'marketer'
