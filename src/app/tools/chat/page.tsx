import { ChatInterface } from '@/components/tools/ChatInterface'
import { Bot } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Community Chat' }

export default function ChatPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 pt-28 pb-16">
      <div className="mb-12 reveal">
        <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold tracking-tight mb-3" style={{ letterSpacing: '-0.03em' }}>
          Community Chat
        </h1>
        <p className="text-[17px] text-muted-foreground font-light max-w-2xl">
          Chat with an AI that knows every member. Ask about skills, find connections, or explore the community.
        </p>
      </div>
      <ChatInterface />
    </div>
  )
}
