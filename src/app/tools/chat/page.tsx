import { ChatInterface } from '@/components/tools/ChatInterface'
import { Bot } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Community Chat' }

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Community Chat</h1>
        </div>
        <p className="text-muted-foreground">
          Chat with an AI that knows every member. Ask about skills, find connections, or explore the community.
        </p>
      </div>
      <ChatInterface />
    </div>
  )
}
