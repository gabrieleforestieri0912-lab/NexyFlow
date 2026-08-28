'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, MessageSquare, ArrowRight, User, LogIn, Zap } from 'lucide-react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const DEMO_LIMIT = 10

function TypewriterText({ content, onDone }: { content: string; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState('')
  const indexRef = useRef(0)

  useEffect(() => {
    indexRef.current = 0
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetta il testo quando cambia il contenuto
    setDisplayed('')

    const interval = setInterval(() => {
      indexRef.current++
      setDisplayed(content.slice(0, indexRef.current))
      if (indexRef.current >= content.length) {
        clearInterval(interval)
        onDone?.()
      }
    }, 15)

    return () => clearInterval(interval)
  }, [content, onDone])

  return <span>{displayed}</span>
}

export default function AIChatSection() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [showSignupPopup, setShowSignupPopup] = useState(false)
  const [typingIndex, setTypingIndex] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const suggestions = [
    'Come posso aumentare i follower su Instagram?',
    'Qual è il momento migliore per pubblicare su TikTok?',
    'Analizza il mio profilo YouTube',
    'Strategia contenuti per crescite rapida',
  ]

  async function handleSend(overrideMessage?: string) {
    const messageToSend = overrideMessage || input
    if (!messageToSend.trim() || isLoading || showSignupPopup) return

    setHasStarted(true)
    const userMessage: Message = { role: 'user', content: messageToSend }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend, history: messages }),
      })

      const data = await res.json()
      const assistantMessage: Message = { role: 'assistant', content: data.response || data.error || 'Errore nella risposta' }
      setMessages(prev => {
        const newIndex = prev.length
        setTypingIndex(newIndex)
        return [...prev, assistantMessage]
      })
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Si è verificato un errore. Riprova più tardi.' }])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (messages.length >= DEMO_LIMIT && !showSignupPopup) {
      setTimeout(() => setShowSignupPopup(true), 800)
    }
  }, [messages, showSignupPopup])

  return (
    <section className="glass-section py-24 px-4" id="ai-chat">
      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-chip text-red-500 text-sm font-medium mb-4">
            <Zap size={16} />
            AI Assistant
          </div>
          <h2 className="text-4xl md:text-5xl font-normal text-gray-900 mb-4">
            Il tuo <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]">Social Media AI</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Parla con la nostra IA specializzata in social media marketing. Ottieni consigli personalizzati, strategie e analisi in tempo reale.
          </p>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full glass-panel--frost flex items-center justify-center overflow-hidden">
                <img src="/nexyflow.png" alt="Nexyflow" className="w-5 h-5 object-contain" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">AI Assistant</h4>
                <p className="text-xs text-gray-400">Demo • prova gratuita</p>
              </div>
            </div>

          </div>
          <div className="h-[450px] overflow-y-auto p-6 relative">
            {!hasStarted ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center mb-4">
                  <MessageSquare size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-normal text-gray-900 mb-2">Inizia una conversazione</h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Fai una domanda sul tuo social media marketing o scegli un suggerimento qui sotto.
                </p>
                <div className="flex flex-wrap justify-center gap-2.5">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(suggestion)}
                      className="px-4 py-2.5 rounded-xl glass-chip text-gray-600 text-sm font-medium hover:text-[#dc2743] hover:border-[#dc2743] hover:shadow-sm transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                  <div
                    className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center overflow-hidden ${
                      msg.role === 'assistant'
                        ? 'glass-panel--frost'
                        : 'glass-chip'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <img src="/nexyflow.png" alt="AI" className="w-5 h-5 object-contain" />
                    ) : (
                      <User size={16} className="text-gray-500" />
                    )}
                  </div>
                    <div className={`max-w-[75%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                      <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                        {msg.role === 'assistant' && typingIndex === index ? (
                          <TypewriterText content={msg.content} onDone={() => setTypingIndex(null)} />
                        ) : (
                          msg.content
                        )}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full glass-panel--frost flex items-center justify-center overflow-hidden">
                      <img src="/nexyflow.png" alt="AI" className="w-5 h-5 object-contain" />
                    </div>
                    <div className="flex gap-1 py-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {showSignupPopup && (
              <div className="absolute inset-0 z-10 flex items-center justify-center p-6 rounded-b-2xl">
                <div className="glass-panel rounded-2xl p-8 max-w-sm text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center mx-auto mb-5">
                    <LogIn size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-normal text-gray-900 mb-2">Demo terminata</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    Hai raggiunto il limite di {DEMO_LIMIT} messaggi per la demo.
                    Accedi o registrati per continuare a chattare con l&apos;AI senza limiti.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/register"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-medium text-sm hover:shadow-lg hover:shadow-red-500/25 transition-all"
                    >
                      Registrati Gratis
                    </Link>
                    <Link
                      href="/login"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl glass-chip text-gray-700 font-normal text-sm transition-colors"
                    >
                      Ho già un account
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/40 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={showSignupPopup ? 'Demo terminata' : 'Chiedi qualcosa sul social media marketing...'}
                disabled={showSignupPopup}
                className="flex-1 px-4 py-3 glass-input rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading || showSignupPopup}
                className="px-4 py-3 bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-xl text-white font-medium disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-red-500/25"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-2xl text-white font-medium text-base hover:shadow-2xl hover:shadow-red-500/30 hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <Sparkles size={20} />
            Prova la Chat Completa
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
