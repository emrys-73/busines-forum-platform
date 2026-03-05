'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useStreamingChat } from '@/hooks/useStreamingChat'
import { Send, Bot, Trash2 } from 'lucide-react'

export function ChatInterface() {
  const { messages, isStreaming, sendMessage, clearMessages } = useStreamingChat()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    if (!input.trim() || isStreaming) return
    const msg = input.trim()
    setInput('')
    await sendMessage(msg)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-base font-semibold">Community-KI</div>
            <div className="text-sm text-muted-foreground">Kennt jedes Mitglied</div>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="icon" onClick={clearMessages} title="Gespräch löschen">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-12">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-base">Frag mich alles über unsere Community</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                Ich kenne jedes Mitglied — ihre Fähigkeiten, Interessen und woran sie arbeiten. Frag mich nach Verbindungen, Antworten oder erkunde das Ökosystem.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                'Wer arbeitet mit KI?',
                'Wer kann beim Fundraising helfen?',
                'Welche Startups gibt es in unserer Community?',
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => { setInput(prompt); }}
                  className="text-sm px-3 py-1.5 rounded-full border hover:bg-accent transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar className="h-7 w-7 flex-shrink-0">
                  <AvatarFallback className="text-sm">
                    {msg.role === 'user' ? 'Du' : 'AI'}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-base max-w-[80%] ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-muted rounded-tl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.role === 'assistant' && isStreaming && i === messages.length - 1 && (
                    <span className="inline-block w-1 h-4 bg-current animate-pulse ml-1" />
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Frag etwas über die Community..."
            rows={1}
            className="resize-none"
          />
          <Button onClick={handleSend} disabled={!input.trim() || isStreaming} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1.5">Enter zum Senden, Shift+Enter für neue Zeile</p>
      </div>
    </div>
  )
}
