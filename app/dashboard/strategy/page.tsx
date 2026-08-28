'use client'

import { useState, useEffect } from 'react'
import { Target, TrendingUp, Lightbulb, Rocket, Clock, ListChecks, Loader2, AlertCircle } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import Link from 'next/link'

export default function StrategyPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStrategy()
  }, [])

  async function fetchStrategy() {
    try {
      const res = await fetch('/api/strategy')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setData(json)
    } catch (err: any) {
      setError(err.message || 'Errore durante il caricamento della strategia')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#dc2743]" />
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="max-w-md mx-auto mt-12 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-lg font-normal text-white">Caricamento fallito</h2>
          <p className="text-sm text-gray-400">{error}</p>
          <button
            onClick={() => { setLoading(true); setError(''); fetchStrategy(); }}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-normal text-sm rounded-xl transition-all"
          >
            Riprova
          </button>
        </div>
      </ProtectedRoute>
    )
  }

  const { competitors = [], insights = {}, contentPlan = [] } = data || {}

  // Se non ci sono competitor e nessun consiglio (segno che non ci sono account connessi)
  const hasNoConnections = competitors.length === 0 && !insights.growthSpeed

  if (hasNoConnections) {
    return (
      <ProtectedRoute>
        <div className="max-w-lg mx-auto text-center space-y-6 py-12">
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
            <Target className="w-10 h-10 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-normal text-white">Nessun account connesso</h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
              Collega almeno una piattaforma social (Instagram, TikTok o YouTube) per generare il tuo piano di crescita e l&apos;analisi dei competitor.
            </p>
          </div>
          <Link
            href="/dashboard/connect"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-red-500/10"
          >
            Connetti Account
          </Link>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-normal text-white tracking-tight">Strategia di Crescita</h1>
          <p className="text-gray-400 mt-1">Piano editoriale e analisi competitiva generati in tempo reale dall&apos;intelligenza artificiale</p>
        </div>

        {/* Competitor analysis */}
        <div className="bg-white/[0.04] backdrop-blur-[12px] border border-white/[0.08] rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-24 -top-24 w-48 h-48 bg-[#dc2743]/5 blur-[60px] rounded-full pointer-events-none" />
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-[#dc2743]" />
            <h2 className="text-lg font-normal text-white">Analisi Competitore di Nicchia</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-xs font-normal text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 pr-4">Profilo / Canale</th>
                  <th className="py-3.5 px-4">Piattaforma</th>
                  <th className="py-3.5 px-4">Follower Totali</th>
                  <th className="py-3.5 pl-4">Tasso Engagement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {competitors.map((c, i) => (
                  <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 pr-4 text-white font-medium">{c.name}</td>
                    <td className="py-4 px-4 text-gray-400">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-white/5 text-[11px] font-medium text-gray-300">
                        {c.platform}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{c.followers}</td>
                    <td className="py-4 pl-4 text-green-400 font-normal">{c.engagement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insight metrics */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/[0.04] backdrop-blur-[12px] border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden group hover:border-white/10 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#dc2743]/5 to-transparent blur-2xl rounded-full" />
            <Rocket className="w-5 h-5 text-[#dc2743] mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-xs text-gray-500 uppercase font-normal tracking-wider mb-1">Velocità di Crescita</p>
            <p className="text-2xl font-normal text-white">{insights.growthSpeed}</p>
          </div>
          <div className="bg-white/[0.04] backdrop-blur-[12px] border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden group hover:border-white/10 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#8b5cf6]/5 to-transparent blur-2xl rounded-full" />
            <TrendingUp className="w-5 h-5 text-[#8b5cf6] mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-xs text-gray-500 uppercase font-normal tracking-wider mb-1">Formato Consigliato</p>
            <p className="text-2xl font-normal text-white">{insights.topFormat}</p>
          </div>
          <div className="bg-white/[0.04] backdrop-blur-[12px] border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden group hover:border-white/10 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#69C9D0]/5 to-transparent blur-2xl rounded-full" />
            <Target className="w-5 h-5 text-[#69C9D0] mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-xs text-gray-500 uppercase font-normal tracking-wider mb-1">Engagement Stimato</p>
            <p className="text-2xl font-normal text-white text-green-400">{insights.engagementRate}</p>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-[#dc2743]/5 border border-[#dc2743]/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-[#dc2743]/10 blur-[40px] rounded-full pointer-events-none" />
          <div className="flex items-start gap-3 relative z-10">
            <div className="p-2 bg-[#dc2743]/10 border border-[#dc2743]/20 rounded-xl">
              <Lightbulb className="w-5 h-5 text-[#dc2743] flex-shrink-0" />
            </div>
            <div>
              <h3 className="font-normal text-white mb-1">Raccomandazione Strategica AI</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{insights.recommendation}</p>
            </div>
          </div>
        </div>

        {/* Editorial content plan */}
        <div className="bg-white/[0.04] backdrop-blur-[12px] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <ListChecks className="w-5 h-5 text-[#dc2743]" />
            <h2 className="text-lg font-normal text-white">Piano Editoriale di Crescita (4 Settimane)</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {contentPlan.map((week, i) => (
              <div key={i} className="p-5 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#dc2743]" />
                    <span className="font-normal text-white">{week.week}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-normal text-[#dc2743] px-2 py-0.5 rounded bg-[#dc2743]/10 border border-[#dc2743]/15">
                    Focus
                  </span>
                </div>
                <p className="text-sm font-normal text-gray-300 mb-3">{week.focus}</p>
                <ul className="space-y-2">
                  {week.tasks.map((task, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-xs text-gray-400 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#dc2743] mt-1.5 flex-shrink-0" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
