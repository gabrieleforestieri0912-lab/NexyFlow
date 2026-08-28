'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart3, Users, Eye, TrendingUp, Download, Loader2, ChevronRight, Heart, MessageCircle, Award, Film, Flame } from 'lucide-react'
import { YoutubeIcon, TiktokIcon, InstagramIcon } from '@/lib/icons'
import AnalyticsChart from '@/components/AnalyticsChart'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import ProtectedRoute from '@/components/ProtectedRoute'

interface AnalyticsData {
  totalFollowers: number
  totalViews: number
  avgEngagement: number
  totalVideos: number
  totalLikes: number
  totalComments: number
  history: { name: string; followers: number; views: number }[]
  histories: Record<string, { name: string; followers: number; views: number }[]>
  platforms: Record<string, { connected: boolean; stats: any; recentPosts: any[] }>
}

const DAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']

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

  function exportCSV() {
    if (!data) return

    const esc = (v: any) => {
      const s = String(v ?? '')
      return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }
    const line = (cells: any[]) => cells.map(esc).join(';')
    const rows: any[][] = []

    rows.push(['Nexyflow Analytics'])
    rows.push(['Generato il', new Date().toLocaleString('it-IT')])
    rows.push([])

    rows.push(['METRICHE AGGREGATE'])
    rows.push(['Follower totali', data.totalFollowers])
    rows.push(['Visualizzazioni totali', data.totalViews])
    rows.push(['Engagement medio (%)', data.avgEngagement])
    rows.push(['Contenuti totali', data.totalVideos])
    rows.push(['Mi piace', data.totalLikes])
    rows.push(['Commenti', data.totalComments])
    rows.push([])

    rows.push(['ANDAMENTO ULTIMI 7 GIORNI'])
    rows.push(['Giorno', 'Follower', 'Visualizzazioni'])
    for (const h of data.history || []) {
      rows.push([h.name, h.followers, h.views])
    }
    rows.push([])

    rows.push(['DETTAGLIO PER PIATTAFORMA'])
    rows.push(['Piattaforma', 'Connesso', 'Follower/Iscritti', 'Visualizzazioni', 'Engagement (%)', 'Contenuti', 'Mi piace', 'Commenti'])
    for (const [key, cfg] of Object.entries(platformConfig)) {
      const p = data.platforms?.[key]
      rows.push([
        cfg.name,
        p?.connected ? 'Sì' : 'No',
        p?.stats ? (p.stats.followers || p.stats.subscribers || 0) : 0,
        p?.stats?.views || 0,
        p?.stats?.engagement || 0,
        p?.stats?.videos || 0,
        p?.stats?.likes || 0,
        p?.stats?.comments || 0,
      ])
    }

    if (recentContent.length > 0) {
      rows.push([])
      rows.push(['CONTENUTI RECENTI'])
      rows.push(['Piattaforma', 'Contenuto', 'Visualizzazioni', 'Mi piace', 'Commenti', 'Data'])
      for (const item of recentContent) {
        rows.push([
          platformConfig[item.platformKey as keyof typeof platformConfig]?.name || item.platformKey,
          item.title || '',
          item.views,
          item.likes,
          item.comments,
          item.date,
        ])
      }
    }

    const csv = '\uFEFF' + rows.map(line).join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nexyflow-analytics-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const stats = [
    { label: 'Visualizzazioni Totali', value: data?.totalViews?.toLocaleString() || '0', icon: Eye, accent: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Follower Totali', value: data?.totalFollowers?.toLocaleString() || '0', icon: Users, accent: 'text-pink-400', bg: 'bg-pink-500/10' },
    { label: 'Engagement Medio', value: `${data?.avgEngagement || 0}%`, icon: TrendingUp, accent: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Contenuti Totali', value: data?.totalVideos?.toLocaleString() || '0', icon: BarChart3, accent: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Mi Piace', value: data?.totalLikes?.toLocaleString() || '0', icon: Heart, accent: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Commenti', value: data?.totalComments?.toLocaleString() || '0', icon: MessageCircle, accent: 'text-amber-400', bg: 'bg-amber-500/10' },
  ]

  const connectedKeys = useMemo(
    () => ['instagram', 'tiktok', 'youtube'].filter((k) => data?.platforms?.[k]?.connected),
    [data]
  )

  const comparisonData = useMemo(() => {
    if (!data?.histories || connectedKeys.length === 0) return []
    const byName: Record<string, any> = {}
    for (const key of connectedKeys) {
      for (const point of data.histories[key] || []) {
        byName[point.name] = {
          ...(byName[point.name] || {}),
          name: point.name,
          [key]: chartMode === 'followers' ? point.followers : point.views,
        }
      }
    }
    return DAYS.map((d) => byName[d]).filter(Boolean)
  }, [data, connectedKeys, chartMode])

  const highlights = useMemo(() => {
    if (connectedKeys.length === 0) return null
    const count = (k: string) => data?.platforms?.[k]?.stats?.followers || data?.platforms?.[k]?.stats?.subscribers || 0
    const eng = (k: string) => data?.platforms?.[k]?.stats?.engagement || 0
    const likes = (k: string) => data?.platforms?.[k]?.stats?.likes || 0
    const byFollowers = [...connectedKeys].sort((a, b) => count(b) - count(a))[0]
    const byEng = [...connectedKeys].sort((a, b) => eng(b) - eng(a))[0]
    const byLikes = [...connectedKeys].sort((a, b) => likes(b) - likes(a))[0]
    return { byFollowers, byEng, byLikes, count, eng, likes }
  }, [data, connectedKeys])

  const recentContent = useMemo(() => {
    if (!data?.platforms) return []
    return Object.entries(data.platforms)
      .filter(([_, p]) => p.connected && p.recentPosts?.length)
      .flatMap(([key, p]) => (p.recentPosts || []).map((rp: any) => ({ ...rp, platformKey: key })))
      .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
      .slice(0, 8)
  }, [data])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#dc2743]" />
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-normal text-white tracking-tight">Analytics Avanzate</h1>
            <p className="text-gray-400 mt-1 font-normal">Analisi in profondità: like, commenti, contenuti e trend di tutti i canali connessi</p>
          </div>
          <button
            onClick={exportCSV}
            disabled={!data}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white font-normal text-sm hover:bg-white/5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Esporta Dati
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* Main trend chart — same component as dashboard for consistency */}
        <div className="bg-white/[0.04] backdrop-blur-[12px] border border-white/[0.08] rounded-2xl p-6 shadow-xl relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-normal text-white">Andamento Temporale</h2>
              <p className="text-xs text-gray-500 mt-0.5">Variazioni giornaliere aggregate su tutti i canali</p>
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

        {/* Cross-platform comparison + best platform */}
        {connectedKeys.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white/[0.04] backdrop-blur-[12px] border border-white/[0.08] rounded-2xl p-6 relative">
              <div>
                <h2 className="text-base font-normal text-white">Confronto Piattaforme</h2>
                <p className="text-xs text-gray-500 mt-0.5">Andamento {chartMode === 'followers' ? 'follower' : 'visualizzazioni'} per canale — ultimi 7 giorni</p>
              </div>
              <div className="h-[260px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      {connectedKeys.map((key) => (
                        <linearGradient key={key} id={`cmp-${key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={platformConfig[key as keyof typeof platformConfig].color} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={platformConfig[key as keyof typeof platformConfig].color} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" stroke="transparent" tick={{ fill: 'rgba(156,163,175,0.7)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="transparent" tick={{ fill: 'rgba(156,163,175,0.7)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'rgba(9,9,15,0.96)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                      formatter={(value: any, name: any) => [value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value, platformConfig[name as keyof typeof platformConfig]?.name || name]}
                    />
                    {connectedKeys.map((key) => (
                      <Area
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={platformConfig[key as keyof typeof platformConfig].color}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill={`url(#cmp-${key})`}
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 2, stroke: '#09090f' }}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                {connectedKeys.map((key) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: platformConfig[key as keyof typeof platformConfig].color }} />
                    <span className="text-[11px] text-gray-400">{platformConfig[key as keyof typeof platformConfig].name}</span>
                  </div>
                ))}
              </div>
            </div>

            {highlights && (
              <div className="bg-white/[0.04] backdrop-blur-[12px] border border-white/[0.08] rounded-2xl p-6 relative">
                <div className="flex items-center gap-2 mb-5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <h2 className="text-base font-normal text-white">Piattaforma Migliore</h2>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Più follower', key: highlights.byFollowers, value: highlights.count(highlights.byFollowers) },
                    { label: 'Migliore engagement', key: highlights.byEng, value: `${highlights.eng(highlights.byEng)}%` },
                    { label: 'Più like', key: highlights.byLikes, value: highlights.likes(highlights.byLikes).toLocaleString() },
                  ].map((row, i) => {
                    const cfg = platformConfig[row.key as keyof typeof platformConfig]
                    return (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cfg.gradient} flex items-center justify-center`}>
                            <cfg.icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">{row.label}</p>
                            <p className="text-sm text-white">{cfg.name}</p>
                          </div>
                        </div>
                        <span className="text-sm text-white font-normal">{row.value.toLocaleString()}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recent content */}
        {recentContent.length > 0 && (
          <div className="bg-white/[0.04] backdrop-blur-[12px] border border-white/[0.08] rounded-2xl p-6 relative">
            <div className="flex items-center gap-2 mb-1">
              <Film className="w-4 h-4 text-purple-400" />
              <h2 className="text-base font-normal text-white">Contenuti Recenti</h2>
            </div>
            <p className="text-xs text-gray-500 mb-4">Reel, video TikTok e YouTube con il maggior numero di visualizzazioni</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 font-normal">Piattaforma</th>
                    <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 font-normal">Contenuto</th>
                    <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 font-normal">Visualizzazioni</th>
                    <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 font-normal">Mi Piace</th>
                    <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 font-normal">Commenti</th>
                    <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 font-normal">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {recentContent.map((item, i) => {
                    const cfg = platformConfig[item.platformKey as keyof typeof platformConfig]
                    return (
                      <tr key={`${item.platformKey}-${item.id || i}`} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${cfg.gradient} flex items-center justify-center`}>
                              <cfg.icon className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-gray-300 text-xs">{cfg.name}</span>
                          </div>
                        </td>
                        <td className="py-3 text-white max-w-[280px]">
                          <span className="truncate inline-block align-middle">{item.title || '—'}</span>
                        </td>
                        <td className="py-3 text-white">{item.views.toLocaleString()}</td>
                        <td className="py-3 text-white flex items-center gap-1"><Heart className="w-3 h-3 text-red-400" />{item.likes.toLocaleString()}</td>
                        <td className="py-3 text-white flex items-center gap-1"><MessageCircle className="w-3 h-3 text-amber-400" />{item.comments.toLocaleString()}</td>
                        <td className="py-3 text-gray-400 text-[11px]">{item.date}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Platform navigation */}
        <div>
          <h2 className="text-lg font-normal text-white mb-4 flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#dc2743]" />
            Analisi per Piattaforma
          </h2>
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
                    <div className="space-y-1.5">
                      <p className="text-sm text-gray-300">
                        {(stats.followers || stats.subscribers || 0).toLocaleString()} {key === 'youtube' ? 'iscritti' : 'follower'}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span>{stats.views?.toLocaleString()} visualizzazioni</span>
                        <span className="flex items-center gap-1 text-red-400/80"><Heart className="w-3 h-3" />{stats.likes?.toLocaleString()}</span>
                        <span className="flex items-center gap-1 text-amber-400/80"><MessageCircle className="w-3 h-3" />{stats.comments?.toLocaleString()}</span>
                      </div>
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
