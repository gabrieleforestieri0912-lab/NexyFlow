'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Eye, Heart, Music, TrendingUp, Clock, ArrowUp, Loader2, Activity, Target, BarChart3, Share2, Play, Tag } from 'lucide-react'
import { TiktokIcon } from '@/lib/icons'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import ProtectedRoute from '@/components/ProtectedRoute'

interface TikTokDetailed {
  followers: number; following: number; likes: number; videos: number; engagement: number
  avgWatchTime: number; completionRate: number; shareRate: number; commentRate: number; profileViews: number
  trendingVideos: { id: string; plays: number; likes: number; shares: number; comments: number; date: string }[]
  topHashtags: { tag: string; count: number }[]
  bestPostingTime: string; growthRate: number
  followerHistory: { name: string; value: number }[]
  engagementHistory: { name: string; value: number }[]
}

export default function TikTokAnalyticsPage() {
  const router = useRouter()
  const [data, setData] = useState<TikTokDetailed | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetch('/api/analytics?platform=tiktok').then(r => r.json()).then(setData).catch(console.error).finally(() => setLoading(false)) }, [])

  if (loading) return (
    <ProtectedRoute><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div></ProtectedRoute>
  )

  if (!data) return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <TiktokIcon className="w-12 h-12 text-gray-600" />
        <p className="text-gray-400">Connetti TikTok per vedere le analitiche</p>
        <button onClick={() => router.push('/dashboard/connect')} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-zinc-800 to-black text-white text-sm border border-white/10">Connetti TikTok</button>
      </div>
    </ProtectedRoute>
  )

  const statCards = [
    { label: 'Follower', value: data.followers.toLocaleString(), icon: Users, color: '#69C9D0', bg: 'rgba(105,201,208,0.1)' },
    { label: 'Mi Piace Totali', value: data.likes.toLocaleString(), icon: Heart, color: '#EE1D52', bg: 'rgba(238,29,82,0.1)' },
    { label: 'Video Pubblicati', value: data.videos.toLocaleString(), icon: Play, color: '#69C9D0', bg: 'rgba(105,201,208,0.1)' },
    { label: 'Engagement', value: `${data.engagement}%`, icon: Activity, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    { label: 'Watch Time Medio', value: `${data.avgWatchTime}s`, icon: Clock, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Tasso Completamento', value: `${data.completionRate}%`, icon: TrendingUp, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
    { label: 'Share Rate', value: `${data.shareRate}%`, icon: Share2, color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
    { label: 'Visite Profilo', value: data.profileViews.toLocaleString(), icon: Eye, color: '#EE1D52', bg: 'rgba(238,29,82,0.1)' },
  ]

  return (
    <ProtectedRoute>
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center shadow-lg shadow-zinc-900/50 border border-white/10">
              <TiktokIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-normal text-white tracking-tight">TikTok Analytics</h1>
              <p className="text-sm text-gray-500">Metriche dettagliate e performance del profilo</p>
            </div>
          </div>
          <button onClick={() => router.push('/dashboard/analytics')} className="px-4 py-2 rounded-xl border border-white/10 text-gray-300 text-sm hover:bg-white/5 transition-all">← Panoramica</button>
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
                <h2 className="text-sm font-normal text-white">Crescita Follower</h2>
                <p className="text-[11px] text-gray-500 mt-0.5">Ultimi 7 giorni</p>
              </div>
              <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full">
                <ArrowUp className="w-3 h-3" /> {data.growthRate}%
              </span>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.followerHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs><linearGradient id="ttFollowerGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#69C9D0" stopOpacity={0.25} /><stop offset="95%" stopColor="#69C9D0" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" stroke="transparent" tick={{ fill: 'rgba(156,163,175,0.7)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="transparent" tick={{ fill: 'rgba(156,163,175,0.7)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(9,9,15,0.96)', border: '1px solid rgba(105,201,208,0.3)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="value" stroke="#69C9D0" strokeWidth={2} fillOpacity={1} fill="url(#ttFollowerGrad)" dot={false} activeDot={{ r: 4, fill: '#69C9D0', strokeWidth: 2, stroke: '#09090f' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-normal text-white">Engagement Rate</h2>
                <p className="text-[11px] text-gray-500 mt-0.5">Ultimi 7 giorni</p>
              </div>
              <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" /> {data.engagement}%
              </span>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.engagementHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs><linearGradient id="ttEngGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EE1D52" stopOpacity={0.25} /><stop offset="95%" stopColor="#EE1D52" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" stroke="transparent" tick={{ fill: 'rgba(156,163,175,0.7)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="transparent" tick={{ fill: 'rgba(156,163,175,0.7)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 'auto']} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(9,9,15,0.96)', border: '1px solid rgba(238,29,82,0.3)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} formatter={(v: number) => [`${v}%`, 'Engagement']} />
                  <Area type="monotone" dataKey="value" stroke="#EE1D52" strokeWidth={2} fillOpacity={1} fill="url(#ttEngGrad)" dot={false} activeDot={{ r: 4, fill: '#EE1D52', strokeWidth: 2, stroke: '#09090f' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-normal text-white">Performance Video</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-400">Watch Time Medio</span><span className="text-white">{data.avgWatchTime}s</span></div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 rounded-full" style={{ width: `${Math.min(100, (data.avgWatchTime / 60) * 100)}%` }} /></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-400">Completamento Video</span><span className="text-white">{data.completionRate}%</span></div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-purple-500 rounded-full" style={{ width: `${data.completionRate}%` }} /></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-400">Share Rate</span><span className="text-white">{data.shareRate}%</span></div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.min(100, data.shareRate * 10)}%` }} /></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-400">Comment Rate</span><span className="text-white">{data.commentRate}%</span></div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-pink-500 rounded-full" style={{ width: `${Math.min(100, data.commentRate * 10)}%` }} /></div>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Music className="w-4 h-4 text-pink-400" />
              <h2 className="text-sm font-normal text-white">Hashtag Più Usati</h2>
            </div>
            <div className="space-y-3">
              {data.topHashtags.map((h, i) => (
                <div key={h.tag} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-4">#{i + 1}</span>
                    <span className="text-sm text-white font-mono">{h.tag}</span>
                  </div>
                  <span className="text-xs text-gray-400">{h.count} video</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-400">Crescita Settimanale</span>
                <span className="text-green-400">+{data.growthRate}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Miglior orario</span>
                <span className="text-white">{data.bestPostingTime}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-normal text-white">Riepilogo Engagement</h2>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[
                    { name: 'Like', value: data.likes, color: '#EE1D52' },
                    { name: 'Commenti', value: data.trendingVideos.reduce((a, v) => a + v.comments, 0), color: '#69C9D0' },
                    { name: 'Share', value: data.trendingVideos.reduce((a, v) => a + v.shares, 0), color: '#f97316' },
                  ]} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value">
                    {[
                      { color: '#EE1D52' },
                      { color: '#69C9D0' },
                      { color: '#f97316' },
                    ].map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(9,9,15,0.96)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-1">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#EE1D52]" /><span className="text-[11px] text-gray-400">Like</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#69C9D0]" /><span className="text-[11px] text-gray-400">Commenti</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#f97316]" /><span className="text-[11px] text-gray-400">Share</span></div>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-normal text-white">Video Trend</h2>
              <p className="text-[11px] text-gray-500 mt-0.5">I 5 video con più visualizzazioni</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 font-normal">#</th>
                  <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 font-normal">Visualizzazioni</th>
                  <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 font-normal">Like</th>
                  <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 font-normal">Share</th>
                  <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 font-normal">Commenti</th>
                  <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 font-normal">Data</th>
                </tr>
              </thead>
              <tbody>
                {data.trendingVideos.map((video, i) => (
                  <tr key={video.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 text-white font-mono text-xs">{i + 1}</td>
                    <td className="py-3 text-white">{video.plays.toLocaleString()}</td>
                    <td className="py-3 text-white">{video.likes.toLocaleString()}</td>
                    <td className="py-3 text-white">{video.shares.toLocaleString()}</td>
                    <td className="py-3 text-white">{video.comments.toLocaleString()}</td>
                    <td className="py-3 text-gray-400 text-[11px]">{video.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-normal text-white">Performance Video</h2>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.trendingVideos} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="id" stroke="transparent" tick={{ fill: 'rgba(156,163,175,0.7)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="transparent" tick={{ fill: 'rgba(156,163,175,0.7)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(9,9,15,0.96)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Bar dataKey="plays" fill="#69C9D0" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="likes" fill="#EE1D52" radius={[4, 4, 0, 0]} barSize={20} />
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
                <p className="text-sm text-white flex items-center gap-2"><Music className="w-4 h-4 text-pink-400 flex-shrink-0" /> Engagement: {data.engagement}%</p>
                <p className="text-xs text-gray-500 mt-1">{data.engagement > 5 ? 'Ottimo! I tuoi contenuti risuonano bene col pubblico.' : 'Prova a utilizzare suoni di tendenza per aumentare la portata organica.'}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-sm text-white flex items-center gap-2"><Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" /> Pubblica verso {data.bestPostingTime}</p>
                <p className="text-xs text-gray-500 mt-1">Questo è il momento in cui il tuo pubblico è più attivo su TikTok.</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-sm text-white flex items-center gap-2"><BarChart3 className="w-4 h-4 text-blue-400 flex-shrink-0" /> Completamento: {data.completionRate}%</p>
                <p className="text-xs text-gray-500 mt-1">{data.completionRate > 30 ? 'I tuoi video mantengono l\'attenzione! Cerca di mantenere i primi 3 secondi coinvolgenti.' : 'Prova video più brevi e un hook più forte nei primi 2 secondi.'}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-sm text-white flex items-center gap-2"><Tag className="w-4 h-4 text-orange-400 flex-shrink-0" /> Usa #fyp e hashtag di nicchia</p>
                <p className="text-xs text-gray-500 mt-1">Mescola hashtag popolari con hashtag specifici del tuo settore per massimizzare la scopribilità.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
