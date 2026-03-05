import { ChatInterface } from '@/components/tools/ChatInterface'
import { Bot } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Community Chat' }

export default function ChatPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 pt-24 pb-8">
      <div className="mb-6 reveal">
        <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold tracking-tight mb-1.5" style={{ letterSpacing: '-0.03em' }}>
          Community Chat
        </h1>
        <p className="text-[15px] text-muted-foreground font-normal">
          Chatte mit einer KI, die jedes Mitglied kennt.
        </p>
      </div>
      <ChatInterface />
    </div>
  )
}
