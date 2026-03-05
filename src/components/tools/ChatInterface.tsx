'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useStreamingChat } from '@/hooks/useStreamingChat'
import { Send, Bot, Trash2, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export function ChatInterface() {
  const { messages, isStreaming, sendMessage, clearMessages } = useStreamingChat()
  const [input, setInput] = useState('')
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isAutoScrollRef = useRef(true)

  const scrollToBottom = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el || !isAutoScrollRef.current) return
    el.scrollTop = el.scrollHeight
  }, [])

  // Scroll on new messages / streaming chunks
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Track whether user has scrolled up (disable auto-scroll)
  function handleScroll() {
    const el = scrollContainerRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    isAutoScrollRef.current = distanceFromBottom < 80
  }

  async function handleSend() {
    if (!input.trim() || isStreaming) return
    const msg = input.trim()
    setInput('')
    isAutoScrollRef.current = true
    await sendMessage(msg)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleSuggestion(prompt: string) {
    if (isStreaming) return
    isAutoScrollRef.current = true
    setInput('')
    sendMessage(prompt)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] min-h-100 max-h-200 border rounded-2xl overflow-hidden bg-background shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b bg-muted/20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-[15px] font-semibold leading-tight">Community-KI</div>
            <div className="text-xs text-muted-foreground">
              {isStreaming ? 'Schreibt...' : 'Kennt jedes Mitglied'}
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearMessages}
            disabled={isStreaming}
            className="h-8 w-8"
            title="Gespräch löschen"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Messages area - plain div with overflow, NOT ScrollArea */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overscroll-contain px-5 py-4"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-base">Frag mich alles über unsere Community</p>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
                Ich kenne jedes Mitglied — ihre Fähigkeiten, Interessen und woran sie arbeiten.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-1">
              {[
                'Wer arbeitet mit KI?',
                'Wer kann beim Fundraising helfen?',
                'Welche Startups gibt es?',
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSuggestion(prompt)}
                  className="text-sm px-3.5 py-1.5 rounded-full border hover:bg-accent transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                  <AvatarFallback className="text-xs">
                    {msg.role === 'user' ? 'Du' : 'KI'}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-2xl px-4 py-2.5 max-w-[80%] ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-muted rounded-tl-sm'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="text-[15px] leading-relaxed prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                      {msg.content ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : isStreaming && i === messages.length - 1 ? (
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        </span>
                      ) : null}
                      {msg.content && isStreaming && i === messages.length - 1 && (
                        <span className="inline-block w-0.5 h-4 bg-current animate-pulse ml-0.5 align-text-bottom" />
                      )}
                    </div>
                  ) : (
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="px-5 py-3.5 border-t bg-muted/10 shrink-0">
        <div className="flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Frag etwas über die Community..."
            rows={1}
            className="resize-none min-h-10.5 max-h-30 text-[15px]"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            size="icon"
            className="h-10.5 w-10.5 shrink-0 rounded-xl"
          >
            {isStreaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Enter zum Senden · Shift+Enter für neue Zeile
        </p>
      </div>
    </div>
  )
}
