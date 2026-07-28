'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Eye, Heart, MessageCircle, ThumbsUp, TrendingUp, Clock, ArrowUp, ArrowDown, Loader2, Activity, Target, BarChart3, Share2, Video, Play, Search, RefreshCw } from 'lucide-react'
import { YoutubeIcon } from '@/lib/icons'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import ProtectedRoute from '@/components/ProtectedRoute'

interface YouTubeDetailed {
  subscribers: number; views: number; videos: number; engagement: number
  avgViewDuration: number; watchTime: number; likes: number; comments: number
  impressions: number; clickThroughRate: number
  trafficSources: { source: string; percentage: number }[]
  topVideos: { id: string; title: string; views: number; likes: number; comments: number; date: string; thumbnail?: string }[]
  uploadFrequency: string; growthRate: number
  subscriberHistory: { name: string; value: number }[]
  viewsHistory: { name: string; value: number }[]
}

export default function YouTubeAnalyticsPage() {
  const router = useRouter()
  const [data, setData] = useState<YouTubeDetailed | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => { fetchAnalytics() }, [])

  async function fetchAnalytics() {
    setLoading(true)
    try {
      const res = await fetch('/api/analytics?platform=youtube')
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error('Failed to fetch YouTube analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  async function syncYouTube() {
    setSyncing(true)
    try {
      const res = await fetch('/api/sync/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      if (res.ok) {
        await fetchAnalytics()
      } else {
        console.error('YouTube sync failed:', await res.text())
      }
    } catch (err) {
      console.error('YouTube sync error:', err)
    } finally {
      setSyncing(false)
    }
  }

  if (loading) return (
    <ProtectedRoute><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-red-500" /></div></ProtectedRoute>
  )

  if (!data) return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <YoutubeIcon className="w-12 h-12 text-gray-600" />
        <p className="text-gray-400">Connetti YouTube per vedere le analitiche</p>
        <button onClick={() => router.push('/dashboard/connect')} className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm hover:bg-red-700 transition-all">Connetti YouTube</button>
      </div>
    </ProtectedRoute>
  )

  const totalEngagement = data.likes + data.comments
  const statCards = [
    { label: 'Iscritti', value: data.subscribers.toLocaleString(), icon: Users, color: '#FF0000', bg: 'rgba(255,0,0,0.1)' },
    { label: 'Visualizzazioni', value: data.views.toLocaleString(), icon: Eye, color: '#FF0000', bg: 'rgba(255,0,0,0.1)' },
    { label: 'Video Pubblicati', value: data.videos.toLocaleString(), icon: Video, color: '#FF0000', bg: 'rgba(255,0,0,0.1)' },
    { label: 'Engagement', value: `${data.engagement}%`, icon: Activity, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    { label: 'Watch Time', value: `${(data.watchTime / 60).toFixed(0)}h`, icon: Clock, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Durata Media', value: `${data.avgViewDuration}min`, icon: TrendingUp, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
    { label: 'Like Totali', value: data.likes.toLocaleString(), icon: ThumbsUp, color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
    { label: 'Commenti', value: data.comments.toLocaleString(), icon: MessageCircle, color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
  ]

  const trafficData = data.trafficSources
  const COLORS = ['#FF0000', '#2563eb', '#22c55e', '#f97316', '#8b5cf6']

  return (
    <ProtectedRoute>
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
              <YoutubeIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-normal text-white tracking-tight">YouTube Analytics</h1>
              <p className="text-sm text-gray-500">Metriche dettagliate e performance del canale</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={syncYouTube}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-gray-300 text-sm hover:bg-white/5 transition-all disabled:opacity-50"
            >
              {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {syncing ? 'Sincronizzazione...' : 'Sincronizza'}
            </button>
            <button onClick={() => router.push('/dashboard/analytics')} className="px-4 py-2 rounded-xl border border-white/10 text-gray-300 text-sm hover:bg-white/5 transition-all">← Panoramica</button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statCards.map((s, i) => (
            <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 hover:border-white/10 transition-all" style={{ animation: `fadeInUp 0.4s cubic-bezier(0.16,1,0.3,1) both ${i * 0.03}s` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.bg }}><s.icon className="w-4 h-4" style={{ color: s.color }} /></div>
              </div>
              <p className="text-xl font-normal text-white tracking-tight">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-normal text-white">Crescita Iscritti</h2>
                <p className="text-[11px] text-gray-500 mt-0.5">Ultimi 7 giorni</p>
              </div>
              <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full">
                <ArrowUp className="w-3 h-3" /> {data.growthRate}%
              </span>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.subscriberHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs><linearGradient id="ytSubGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF0000" stopOpacity={0.25} /><stop offset="95%" stopColor="#FF0000" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" stroke="transparent" tick={{ fill: 'rgba(156,163,175,0.7)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="transparent" tick={{ fill: 'rgba(156,163,175,0.7)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(9,9,15,0.96)', border: '1px solid rgba(255,0,0,0.3)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="value" stroke="#FF0000" strokeWidth={2} fillOpacity={1} fill="url(#ytSubGrad)" dot={false} activeDot={{ r: 4, fill: '#FF0000', strokeWidth: 2, stroke: '#09090f' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-normal text-white">Visualizzazioni Giornaliere</h2>
                <p className="text-[11px] text-gray-500 mt-0.5">Ultimi 7 giorni</p>
              </div>
              <span className="flex items-center gap-1 text-xs text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" /> {(data.views / data.videos / 7).toFixed(0)}/gg
              </span>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.viewsHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs><linearGradient id="ytViewsGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} /><stop offset="95%" stopColor="#2563eb" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" stroke="transparent" tick={{ fill: 'rgba(156,163,175,0.7)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="transparent" tick={{ fill: 'rgba(156,163,175,0.7)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(9,9,15,0.96)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#ytViewsGrad)" dot={false} activeDot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#09090f' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-red-400" />
              <h2 className="text-sm font-normal text-white">Performance Canale</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-400">Watch Time Totale</span><span className="text-white">{(data.watchTime / 60).toFixed(0)} ore</span></div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(100, (data.watchTime / 60000) * 100)}%` }} /></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-400">Durata Media Visione</span><span className="text-white">{data.avgViewDuration} min</span></div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (data.avgViewDuration / 15) * 100)}%` }} /></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-400">Impressions</span><span className="text-white">{data.impressions.toLocaleString()}</span></div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-purple-500 rounded-full" style={{ width: '100%' }} /></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-400">CTR Impressioni</span><span className="text-white">{data.clickThroughRate}%</span></div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(100, data.clickThroughRate * 5)}%` }} /></div>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-normal text-white">Fonti di Traffico</h2>
            </div>
            <div className="space-y-3">
              {trafficData.map((source, i) => (
                <div key={source.source}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{source.source}</span>
                    <span className="text-white">{source.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${source.percentage}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-400">Frequenza Caricamento</span>
                <span className="text-white">{data.uploadFrequency}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Like/Video</span>
                <span className="text-white">{Math.floor(data.likes / data.videos).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-red-400" />
              <h2 className="text-sm font-normal text-white">Ripartizione Engagement</h2>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[
                    { name: 'Like', value: data.likes, color: '#2563eb' },
                    { name: 'Commenti', value: data.comments, color: '#f97316' },
                    { name: 'Visualizzazioni', value: Math.floor(data.views * 0.01), color: '#FF0000' },
                  ]} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value">
                    {[{ color: '#2563eb' }, { color: '#f97316' }, { color: '#FF0000' }].map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(9,9,15,0.96)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-1">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" /><span className="text-[11px] text-gray-400">Like</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#f97316]" /><span className="text-[11px] text-gray-400">Commenti</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#FF0000]" /><span className="text-[11px] text-gray-400">Views (1%)</span></div>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-normal text-white">Top Video</h2>
              <p className="text-[11px] text-gray-500 mt-0.5">I 5 video con più visualizzazioni</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 font-normal">Titolo</th>
                  <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 font-normal">Visualizzazioni</th>
                  <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 font-normal">Like</th>
                  <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 font-normal">Commenti</th>
                  <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 font-normal">Rapporto L/V</th>
                  <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 font-normal">Data</th>
                </tr>
              </thead>
              <tbody>
                {data.topVideos.map((video, i) => {
                  const ratio = ((video.likes / video.views) * 100).toFixed(1)
                  return (
                    <tr key={video.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 text-white max-w-[250px]">
                        <div className="flex items-center gap-3">
                          {video.thumbnail ? (
                            <img src={video.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover bg-white/5" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                              <Video className="w-4 h-4 text-gray-500" />
                            </div>
                          )}
                          <span className="truncate">{video.title}</span>
                        </div>
                      </td>
                      <td className="py-3 text-white">{video.views.toLocaleString()}</td>
                      <td className="py-3 text-white">{video.likes.toLocaleString()}</td>
                      <td className="py-3 text-white">{video.comments.toLocaleString()}</td>
                      <td className="py-3"><span className="text-green-400">{ratio}%</span></td>
                      <td className="py-3 text-gray-400 text-[11px]">{video.date}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Video className="w-4 h-4 text-red-400" />
              <h2 className="text-sm font-normal text-white">Confronto Video</h2>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topVideos} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="title" stroke="transparent" tick={{ fill: 'rgba(156,163,175,0.7)', fontSize: 10 }} axisLine={false} tickLine={false} interval={0} angle={-15} textAnchor="end" height={60} />
                  <YAxis stroke="transparent" tick={{ fill: 'rgba(156,163,175,0.7)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(9,9,15,0.96)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Bar dataKey="views" fill="#FF0000" radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar dataKey="likes" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Share2 className="w-4 h-4 text-orange-400" />
              <h2 className="text-sm font-normal text-white">Suggerimenti</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-sm text-white">📈 Il tuo CTR è del {data.clickThroughRate}%</p>
                <p className="text-xs text-gray-500 mt-1">{data.clickThroughRate > 5 ? 'Ottimo! I tuoi titoli e thumbnail stanno funzionando bene.' : 'Prova a ottimizzare thumbnail e titoli per aumentare il tasso di clic.'}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-sm text-white">⏱️ Durata media visione: {data.avgViewDuration} min</p>
                <p className="text-xs text-gray-500 mt-1">{data.avgViewDuration > 6 ? 'Ottima fidelizzazione! I tuoi contenuti intrattengono il pubblico.' : 'Prova a rendere i video più coinvolgenti nei primi minuti.'}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-sm text-white">🔍 La Ricerca YouTube è la tua fonte principale</p>
                <p className="text-xs text-gray-500 mt-1">Ottimizza titoli, descrizioni e tag per la SEO di YouTube per sfruttare al meglio il traffico da ricerca.</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-sm text-white">📅 Carichi {data.uploadFrequency}</p>
                <p className="text-xs text-gray-500 mt-1">La consistenza è fondamentale. Mantieni un programma di pubblicazione regolare per far crescere il canale.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
