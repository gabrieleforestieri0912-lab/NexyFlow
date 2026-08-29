'use client'

import { useState } from 'react'
import { FileText, Copy, Check, Loader2, Sparkles } from 'lucide-react'
import { YoutubeIcon, InstagramIcon, TiktokIcon } from '@/lib/icons'
import ProtectedRoute from '@/components/ProtectedRoute'

const tools = [
  {
    id: 'script',
    label: 'Script Video',
    icon: YoutubeIcon,
    gradient: 'from-red-600 to-red-800',
    placeholder: 'Descrivi il tipo di video che vuoi creare, gli argomenti principali e il tono di voce...',
  },
  {
    id: 'captions',
    label: 'Caption & Didascalie',
    icon: InstagramIcon,
    gradient: 'from-pink-500 to-purple-500',
    placeholder: 'Descrivi il contenuto del tuo post, l\'obiettivo e gli elementi chiave da includere...',
  },
  {
    id: 'hashtags',
    label: 'Hashtag',
    icon: TiktokIcon,
    gradient: 'from-zinc-800 to-zinc-950',
    placeholder: 'Inserisci l\'argomento principale, le keyword o la nicchia di riferimento...',
  },
]

export default function ContentGeneratorPage() {
  const [activeTool, setActiveTool] = useState('script')
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const currentTool = tools.find(t => t.id === activeTool)

  const generateContent = async () => {
    if (!input.trim()) return
    setLoading(true)
    setResult('')

    const prompts: Record<string, string> = {
      script: `Genera uno script dettagliato per un video social sul tema: "${input}". Includi intro, sviluppo e CTA. Rispondi in italiano.`,
      captions: `Genera 3 caption accattivanti per un post social su: "${input}". Le caption devono essere in italiano, con emoji e hashtag pertinenti.`,
      hashtags: `Genera una lista di 15 hashtag pertinenti per: "${input}". Dividili per categoria (generali, di nicchia, viral). In italiano.`,
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompts[activeTool],
          history: [],
        }),
      })
      const data = await res.json()
      setResult(data.response || data.error || 'Errore nella generazione')
    } catch {
      setResult('Errore durante la generazione. Riprova più tardi.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-normal text-white tracking-tight">AI Content Generator</h1>
          <p className="text-gray-400 mt-1 font-normal font-sans">Sfrutta l&apos;intelligenza artificiale per creare script, caption e hashtag per i tuoi canali.</p>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => { setActiveTool(tool.id); setResult('') }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-normal uppercase tracking-wider transition-all flex-shrink-0 border ${
                activeTool === tool.id
                  ? `bg-[#dc2743]/15 text-white border-[#dc2743]/30 shadow-lg shadow-red-500/5`
                  : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'
              }`}
            >
              <tool.icon className="w-4 h-4" />
              {tool.label}
            </button>
          ))}
        </div>

        {/* Editor Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white/[0.04] backdrop-blur-[12px] border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[420px]">
            <div className="absolute -right-24 -top-24 w-48 h-48 bg-[#dc2743]/5 blur-[60px] rounded-full pointer-events-none" />
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-[#dc2743]" />
                <h2 className="font-normal text-white">Generatore AI</h2>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={currentTool?.placeholder}
                rows={8}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-[#dc2743] focus:ring-2 focus:ring-[#dc2743]/20 outline-none transition-all resize-none text-sm leading-relaxed"
              />
            </div>
            <button
              onClick={generateContent}
              disabled={loading || !input.trim()}
              className="w-full py-3.5 mt-4 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-500/10"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Generazione in corso...' : 'Genera Contenuto'}
            </button>
          </div>

          {/* Output Panel */}
          <div className="bg-white/[0.04] backdrop-blur-[12px] border border-white/[0.08] rounded-2xl p-6 flex flex-col min-h-[420px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-normal text-white">Risultato</h2>
              {result && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-normal text-gray-300 hover:bg-white/10 hover:text-white transition-all active:scale-95"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copiato' : 'Copia'}
                </button>
              )}
            </div>
            <div className="flex-1 rounded-xl bg-white/[0.01] border border-white/5 p-5 overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-[#dc2743]" />
                  <p className="text-xs text-gray-500 font-medium">L&apos;AI sta scrivendo il tuo testo...</p>
                </div>
              ) : result ? (
                <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed font-sans">{result}</p>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-40">
                  <Sparkles className="w-10 h-10 text-gray-400" />
                  <p className="text-xs text-gray-400 font-medium">Fornisci le istruzioni a sinistra per iniziare.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
