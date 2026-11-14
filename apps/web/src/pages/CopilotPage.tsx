import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  ArrowRight,
  ArrowUp,
  Bot,
  ChevronRight,
  CircleHelp,
  Plus,
  ShieldCheck,
  Sparkles,
  Square,
  UserRound,
} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { PageHeading } from '../components/ui/primitives'
import { Button } from '../components/ui/button'
import { copilotSuggestions } from '../mocks/data'
import { getDemoResponse } from '../services/copilot'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}
export default function CopilotPage() {
  const [params] = useSearchParams()
  const [input, setInput] = useState(
    params.get('indicator') ? `Explain this suspicious indicator: ${params.get('indicator')}` : '',
  )
  const [messages, setMessages] = useState<Message[]>([])
  const [pending, setPending] = useState<string | null>(null)
  const scroll = useRef<HTMLDivElement>(null)
  const textarea = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    scroll.current?.scrollTo({ top: scroll.current.scrollHeight, behavior: 'instant' })
  }, [messages, pending])
  useEffect(() => {
    if (!pending) return
    const timer = window.setTimeout(() => {
      setMessages((previous) => [
        ...previous,
        { id: crypto.randomUUID(), role: 'assistant', content: getDemoResponse(pending) },
      ])
      setPending(null)
    }, 750)
    return () => window.clearTimeout(timer)
  }, [pending])
  function send(text: string) {
    if (!text.trim() || pending) return
    setMessages((previous) => [
      ...previous,
      { id: crypto.randomUUID(), role: 'user', content: text.trim() },
    ])
    setPending(text.trim())
    setInput('')
  }
  function submit(event: FormEvent) {
    event.preventDefault()
    send(input)
  }
  return (
    <>
      <PageHeading
        title="Your next investigative advantage."
        description="Explore intelligence with a conversational security assistant."
        actions={
          <Button
            variant="outline"
            onClick={() => {
              setMessages([])
              setPending(null)
              setInput('')
              textarea.current?.focus()
            }}
          >
            <Plus size={14} />
            New conversation
          </Button>
        }
      />
      <div className="copilot-workspace">
        <aside className="panel copilot-sidebar">
          <div className="copilot-sidebar-title">
            <Sparkles size={17} />
            Investigation workspace
          </div>
          <span className="eyebrow">QUICK START</span>
          {copilotSuggestions.map((question, index) => (
            <button key={question} onClick={() => send(question)} disabled={!!pending}>
              <span>0{index + 1}</span>
              {question}
              <ChevronRight size={14} />
            </button>
          ))}
          <div className="copilot-safety">
            <ShieldCheck size={21} />
            <h3>Context before action.</h3>
            <p>
              Validate findings against source evidence and internal telemetry. This demo does not
              perform real analysis or take security actions.
            </p>
          </div>
        </aside>
        <section className="panel chat-panel">
          <div className="chat-panel-header">
            <span className="ai-icon">
              <Sparkles size={17} />
            </span>
            <div>
              <h2>Atlas Copilot</h2>
              <span>Security intelligence assistant</span>
            </div>
            <span className="preview-label">MOCK RESPONSES</span>
          </div>
          <div
            className="chat-scroll"
            ref={scroll}
            role="log"
            aria-live="polite"
            aria-label="Copilot conversation"
          >
            {messages.length === 0 ? (
              <div className="copilot-welcome">
                <div className="copilot-orb">
                  <Sparkles size={32} strokeWidth={1.2} />
                </div>
                <span className="eyebrow">INTELLIGENCE, WITH CONTEXT</span>
                <h2>Make sense of the signal.</h2>
                <p>
                  A starting point for your next investigation.
                  <br />
                  Ask a question to explore a predefined demonstration response.
                </p>
                <div className="welcome-suggestions">
                  {copilotSuggestions.slice(0, 2).map((question) => (
                    <button key={question} onClick={() => send(question)}>
                      {question}
                      <ArrowRight size={15} />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`chat-message message-${message.role}`}>
                  <span
                    className={
                      message.role === 'assistant'
                        ? 'message-avatar ai-icon'
                        : 'message-avatar user-icon'
                    }
                  >
                    {message.role === 'assistant' ? <Bot size={17} /> : <UserRound size={17} />}
                  </span>
                  <div>
                    <strong>
                      {message.role === 'assistant' ? 'Atlas Copilot' : 'You'}
                      {message.role === 'assistant' && (
                        <span className="demo-label">PREDEFINED DEMO</span>
                      )}
                    </strong>
                    <p>{message.content}</p>
                  </div>
                </div>
              ))
            )}
            {pending && (
              <div role="status" className="chat-message">
                <span className="message-avatar ai-icon">
                  <Bot size={17} />
                </span>
                <p className="muted text-sm">
                  Preparing sample response<span className="typing-dots">...</span>
                </p>
              </div>
            )}
          </div>
          <div className="chat-composer">
            <form onSubmit={submit}>
              <textarea
                ref={textarea}
                aria-label="Message Atlas Copilot"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    send(input)
                  }
                }}
                placeholder="Ask about threats, indicators, or investigations..."
                rows={2}
                maxLength={2000}
              />
              {pending ? (
                <Button
                  type="button"
                  size="icon"
                  aria-label="Stop sample response"
                  onClick={() => setPending(null)}
                >
                  <Square size={14} />
                </Button>
              ) : (
                <Button size="icon" aria-label="Send message" disabled={!input.trim()}>
                  <ArrowUp size={18} />
                </Button>
              )}
            </form>
            <p>
              <CircleHelp size={11} />
              Demo only. Predefined replies, no connected AI model. Never enter sensitive data.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
