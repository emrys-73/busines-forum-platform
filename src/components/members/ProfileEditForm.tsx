'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { Member } from '@/types'
import { toast } from 'sonner'
import { X } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  tagline: z.string().max(120, 'Max 120 characters').optional(),
  bio: z.string().max(500, 'Max 500 characters').optional(),
  job_title: z.string().max(100).optional(),
  linkedin_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  website_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  looking_for: z.string().max(300).optional(),
  can_help_with: z.string().max(300).optional(),
})

type FormData = z.infer<typeof schema>

interface ProfileEditFormProps {
  member: Member
  onSaved?: (updated: Member) => void
}

export function ProfileEditForm({ member, onSaved }: ProfileEditFormProps) {
  const [skills, setSkills] = useState<string[]>(member.skills)
  const [interests, setInterests] = useState<string[]>(member.interests)
  const [tags, setTags] = useState<string[]>(member.tags)
  const [skillInput, setSkillInput] = useState('')
  const [interestInput, setInterestInput] = useState('')
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: member.name,
      tagline: member.tagline || '',
      bio: member.bio || '',
      job_title: member.job_title || '',
      linkedin_url: member.linkedin_url || '',
      website_url: member.website_url || '',
      looking_for: member.looking_for || '',
      can_help_with: member.can_help_with || '',
    },
  })

  function addSkill() {
    const s = skillInput.trim()
    if (s && !skills.includes(s)) setSkills((prev) => [...prev, s])
    setSkillInput('')
  }

  function addInterest() {
    const i = interestInput.trim()
    if (i && !interests.includes(i)) setInterests((prev) => [...prev, i])
    setInterestInput('')
  }

  const ALL_TAGS = ['founder', 'investor', 'advisor', 'technical', 'creative', 'operator', 'marketer']

  async function onSubmit(data: FormData) {
    setSaving(true)
    const supabase = createClient()
    const { data: updated, error } = await supabase
      .from('members')
      .update({
        ...data,
        skills,
        interests,
        tags,
        updated_at: new Date().toISOString(),
      })
      .eq('id', member.id)
      .select()
      .single()

    setSaving(false)
    if (error) {
      toast.error('Failed to save profile: ' + error.message)
      return
    }
    toast.success('Profile saved!')
    if (onSaved && updated) onSaved(updated as Member)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="job_title">Job Title</Label>
          <Input id="job_title" {...register('job_title')} placeholder="Founder & CEO" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tagline">Tagline</Label>
        <Input id="tagline" {...register('tagline')} placeholder="One-line description of what you do" />
        {errors.tagline && <p className="text-xs text-destructive">{errors.tagline.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" {...register('bio')} placeholder="Tell the community about yourself..." rows={4} />
        {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="linkedin_url">LinkedIn URL</Label>
          <Input id="linkedin_url" {...register('linkedin_url')} placeholder="https://linkedin.com/in/..." />
          {errors.linkedin_url && <p className="text-xs text-destructive">{errors.linkedin_url.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="website_url">Website URL</Label>
          <Input id="website_url" {...register('website_url')} placeholder="https://yourwebsite.com" />
          {errors.website_url && <p className="text-xs text-destructive">{errors.website_url.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Skills</Label>
        <div className="flex gap-2">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            placeholder="Add a skill and press Enter"
          />
          <Button type="button" variant="secondary" onClick={addSkill}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="gap-1">
              {skill}
              <button type="button" onClick={() => setSkills((p) => p.filter((s) => s !== skill))}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Interests</Label>
        <div className="flex gap-2">
          <Input
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
            placeholder="Add an interest and press Enter"
          />
          <Button type="button" variant="secondary" onClick={addInterest}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {interests.map((interest) => (
            <Badge key={interest} variant="outline" className="gap-1">
              {interest}
              <button type="button" onClick={() => setInterests((p) => p.filter((i) => i !== interest))}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((tag) => (
            <Badge
              key={tag}
              variant={tags.includes(tag) ? 'default' : 'outline'}
              className="cursor-pointer capitalize select-none"
              onClick={() => setTags((prev) =>
                prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
              )}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="looking_for">Looking For</Label>
        <Textarea id="looking_for" {...register('looking_for')} placeholder="What kind of connections or help are you looking for?" rows={2} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="can_help_with">Can Help With</Label>
        <Textarea id="can_help_with" {...register('can_help_with')} placeholder="What can you help others in the community with?" rows={2} />
      </div>

      <Button type="submit" disabled={saving} className="w-full">
        {saving ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  )
}
