'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart3, Users, Eye, TrendingUp, Download, Loader2, ChevronRight } from 'lucide-react'
import { YoutubeIcon, TiktokIcon, InstagramIcon } from '@/lib/icons'
import AnalyticsChart from '@/components/AnalyticsChart'
import ProtectedRoute from '@/components/ProtectedRoute'

interface AnalyticsData {
  totalFollowers: number
  totalViews: number
  avgEngagement: number
  totalVideos: number
  history: { name: string; followers: number; views: number }[]
  platforms: Record<string, { connected: boolean; stats: any }>
}

const platformConfig = {
  instagram: { name: 'Instagram', icon: InstagramIcon, gradient: 'from-[#f09433] via-[#dc2743] to-[#bc1888]', color: '#dc2743', bg: 'bg-pink-500/10' },
  tiktok: { name: 'TikTok', icon: TiktokIcon, gradient: 'from-zinc-900 to-black', color: '#69C9D0', bg: 'bg-cyan-500/10' },
  youtube: { name: 'YouTube', icon: YoutubeIcon, gradient: 'from-red-600 to-red-800', color: '#FF0000', bg: 'bg-red-500/10' },
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [chartMode, setChartMode] = useState<'followers' | 'views'>('followers')

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    try {
      const res = await fetch('/api/analytics')
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#dc2743]" />
      </div>
    )
  }

  const stats = [
    { label: 'Visualizzazioni Totali', value: data?.totalViews?.toLocaleString() || '0', icon: Eye, accent: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Follower Totali', value: data?.totalFollowers?.toLocaleString() || '0', icon: Users, accent: 'text-pink-400', bg: 'bg-pink-500/10' },
    { label: 'Engagement Medio', value: `${data?.avgEngagement || 0}%`, icon: TrendingUp, accent: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Contenuti Totali', value: data?.totalVideos?.toLocaleString() || '0', icon: BarChart3, accent: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  ]

  const connectedPlatforms = Object.entries(data?.platforms || {}).filter(([_, p]) => p.connected).map(([key]) => key)

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-normal text-white tracking-tight">Analytics Avanzate</h1>
            <p className="text-gray-400 mt-1 font-normal">Monitora le performance complessive dei tuoi canali social connessi</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white font-normal text-sm hover:bg-white/5 active:scale-95 transition-all">
            <Download className="w-4 h-4" />
            Esporta Dati
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white/[0.04] backdrop-blur-[12px] border border-white/[0.08] rounded-2xl p-5 hover:border-white/10 transition-all duration-300 relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-16 h-16 ${stat.bg} blur-2xl rounded-full opacity-60 group-hover:scale-125 transition-transform`} />
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${stat.bg} border border-white/5`}>
                  <stat.icon className={`w-5 h-5 ${stat.accent}`} />
                </div>
              </div>
              <p className="text-2xl font-normal text-white tracking-tight">{stat.value}</p>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white/[0.04] backdrop-blur-[12px] border border-white/[0.08] rounded-2xl p-6 shadow-xl relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-normal text-white">Andamento Temporale</h2>
              <p className="text-xs text-gray-500 mt-0.5">Analisi grafica delle variazioni giornaliere</p>
            </div>
            <div className="flex bg-white/5 border border-white/5 rounded-xl p-1 self-start sm:self-auto">
              <button
                onClick={() => setChartMode('followers')}
                className={`px-4 py-2 rounded-lg text-xs font-normal tracking-wide uppercase transition-all ${
                  chartMode === 'followers'
                    ? 'bg-gradient-to-r from-[#f09433] to-[#dc2743] text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Follower
              </button>
              <button
                onClick={() => setChartMode('views')}
                className={`px-4 py-2 rounded-lg text-xs font-normal tracking-wide uppercase transition-all ${
                  chartMode === 'views'
                    ? 'bg-gradient-to-r from-[#dc2743] to-[#bc1888] text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Visualizzazioni
              </button>
            </div>
          </div>
          
          <div className="h-[380px] w-full">
            <AnalyticsChart data={data?.history || []} mode={chartMode} />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-normal text-white mb-4">Analisi per Piattaforma</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(platformConfig).map(([key, config]) => {
              const isConnected = data?.platforms?.[key]?.connected
              const stats = data?.platforms?.[key]?.stats
              return (
                <button
                  key={key}
                  onClick={() => router.push(`/dashboard/analytics/${key}`)}
                  disabled={!isConnected}
                  className={`bg-white/[0.04] backdrop-blur-[12px] border rounded-2xl p-5 text-left transition-all duration-200 group ${
                    isConnected
                      ? 'border-white/[0.08] hover:border-white/20 hover:bg-white/[0.06] hover:-translate-y-0.5'
                      : 'border-white/[0.04] opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}>
                      <config.icon className="w-6 h-6 text-white" />
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-600 ${isConnected ? 'group-hover:translate-x-0.5 transition-transform' : ''}`} />
                  </div>
                  <h3 className="text-base font-normal text-white mb-1">{config.name}</h3>
                  {isConnected && stats ? (
                    <div className="space-y-1">
                      <p className="text-sm text-gray-300">
                        {(stats.followers || stats.subscribers || 0).toLocaleString()} {key === 'youtube' ? 'iscritti' : 'follower'}
                      </p>
                      <p className="text-xs text-gray-500">{stats.views?.toLocaleString()} visualizzazioni</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Connetti il profilo per visualizzare le analitiche dettagliate</p>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
