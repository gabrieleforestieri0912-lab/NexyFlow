'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, LayoutDashboard, BarChart3, Lightbulb, FileText, Link2, Sparkles, Settings, Command } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Action {
  id: string
  label: string
  icon: any
  href: string
  category: string
}

const actions: Action[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', category: 'Navigazione' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics', category: 'Navigazione' },
  { id: 'strategy', label: 'Strategia', icon: Lightbulb, href: '/dashboard/strategy', category: 'Navigazione' },
  { id: 'content', label: 'Content Generator', icon: FileText, href: '/dashboard/tools/content-generator', category: 'Navigazione' },
  { id: 'connect', label: 'Connetti Piattaforme', icon: Link2, href: '/dashboard/connect', category: 'Navigazione' },
  { id: 'analyze', label: 'Analizza Profilo', icon: Sparkles, href: '/dashboard/analyze', category: 'Navigazione' },
  { id: 'settings', label: 'Impostazioni', icon: Settings, href: '/settings', category: 'Navigazione' },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const filtered = query
    ? actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()))
    : actions

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setOpen(prev => !prev)
    }
    if (e.key === 'Escape') {
      setOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <Search size={18} className="text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0) }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, filtered.length - 1)) }
              if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)) }
              if (e.key === 'Enter' && filtered[selectedIndex]) {
                router.push(filtered[selectedIndex].href)
                setOpen(false)
              }
            }}
            placeholder="Cosa vuoi fare?"
            className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
            <Command size={12} />K
          </kbd>
        </div>
        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-8">Nessun risultato per &quot;{query}&quot;</p>
          )}
          {filtered.map((action, index) => (
            <button
              key={action.id}
              onClick={() => { router.push(action.href); setOpen(false) }}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                index === selectedIndex ? 'bg-red-500/20 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <action.icon size={18} />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
