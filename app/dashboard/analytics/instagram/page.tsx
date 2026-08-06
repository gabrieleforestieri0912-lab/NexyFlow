'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Eye, Heart, MessageCircle, Camera, Film, Layout, TrendingUp, Clock, ArrowUp, ArrowDown, Loader2, Activity, Target, BarChart3, Share2, Images } from 'lucide-react'
import { InstagramIcon } from '@/lib/icons'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import ProtectedRoute from '@/components/ProtectedRoute'

interface InstagramDetailed {
  followers: number; following: number; posts: number; engagement: number
  avgLikes: number; avgComments: number; storyCompletionRate: number
  reach: number; impressions: number; profileVisits: number
  contentMix: { photos: number; videos: number; carousels: number }
  topPosts: { id: string; type: string; likes: number; comments: number; date: string }[]
  bestPostingTime: string; growthRate: number
  followerHistory: { name: string; value: number }[]
  engagementHistory: { name: string; value: number }[]
}

export default function InstagramAnalyticsPage() {
  const router = useRouter()
  const [data, setData] = useState<InstagramDetailed | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetch('/api/analytics?platform=instagram').then(r => r.json()).then(setData).catch(console.error).finally(() => setLoading(false)) }, [])

  if (loading) return (
    <ProtectedRoute><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-pink-500" /></div></ProtectedRoute>
  )

  if (!data) return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <InstagramIcon className="w-12 h-12 text-gray-600" />
        <p className="text-gray-400">Connetti Instagram per vedere le analitiche</p>
        <button onClick={() => router.push('/dashboard/connect')} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white text-sm">Connetti Instagram</button>
      </div>
    </ProtectedRoute>
  )

  const contentMixData = [
    { name: 'Foto', value: data.contentMix.photos, color: '#f09433' },
    { name: 'Video', value: data.contentMix.videos, color: '#dc2743' },
    { name: 'Caroselli', value: data.contentMix.carousels, color: '#bc1888' },
  ]

  const engagementRate = data.engagement
  const statCards = [
    { label: 'Follower', value: data.followers.toLocaleString(), icon: Users, color: '#dc2743', bg: 'rgba(220,39,67,0.1)', suffix: '' },
    { label: 'Following', value: data.following.toLocaleString(), icon: Users, color: '#f09433', bg: 'rgba(240,148,51,0.1)', suffix: '' },
    { label: 'Post Totali', value: data.posts.toLocaleString(), icon: Camera, color: '#bc1888', bg: 'rgba(188,24,136,0.1)', suffix: '' },
    { label: 'Engagement', value: `${engagementRate}%`, icon: Activity, color: '#22c55e', bg: 'rgba(34,197,94,0.1)', suffix: '' },
    { label: 'Copertura Media', value: data.reach.toLocaleString(), icon: Eye, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', suffix: '' },
    { label: 'Impressions', value: data.impressions.toLocaleString(), icon: BarChart3, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', suffix: '' },
    { label: 'Media Like', value: data.avgLikes.toLocaleString(), icon: Heart, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', suffix: '' },
    { label: 'Media Commenti', value: data.avgComments.toLocaleString(), icon: MessageCircle, color: '#f97316', bg: 'rgba(249,115,22,0.1)', suffix: '' },
  ]

  const COLORS = ['#f09433', '#dc2743', '#bc1888']

  return (
    <ProtectedRoute>
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shadow-lg shadow-pink-500/20">
              <InstagramIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-normal text-white tracking-tight">Instagram Analytics</h1>
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
                  <defs><linearGradient id="igFollowerGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#dc2743" stopOpacity={0.25} /><stop offset="95%" stopColor="#dc2743" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" stroke="transparent" tick={{ fill: 'rgba(156,163,175,0.7)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="transparent" tick={{ fill: 'rgba(156,163,175,0.7)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(9,9,15,0.96)', border: '1px solid rgba(220,39,67,0.3)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="value" stroke="#dc2743" strokeWidth={2} fillOpacity={1} fill="url(#igFollowerGrad)" dot={false} activeDot={{ r: 4, fill: '#dc2743', strokeWidth: 2, stroke: '#09090f' }} />
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
                <TrendingUp className="w-3 h-3" /> {engagementRate}%
              </span>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.engagementHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs><linearGradient id="igEngGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" stroke="transparent" tick={{ fill: 'rgba(156,163,175,0.7)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="transparent" tick={{ fill: 'rgba(156,163,175,0.7)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 'auto']} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(9,9,15,0.96)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} formatter={(v: number) => [`${v}%`, 'Engagement']} />
                  <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#igEngGrad)" dot={false} activeDot={{ r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#09090f' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-normal text-white">Copertura & Impressioni</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-400">Copertura</span><span className="text-white">{data.reach.toLocaleString()}</span></div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min(100, (data.reach / data.impressions) * 100)}%` }} /></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-400">Impressioni</span><span className="text-white">{data.impressions.toLocaleString()}</span></div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 rounded-full" style={{ width: '100%' }} /></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-400">Visite Profilo</span><span className="text-white">{data.profileVisits.toLocaleString()}</span></div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.min(100, (data.profileVisits / data.impressions) * 100)}%` }} /></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-400">Completamento Stories</span><span className="text-white">{data.storyCompletionRate}%</span></div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-pink-500 rounded-full" style={{ width: `${data.storyCompletionRate}%` }} /></div>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Layout className="w-4 h-4 text-pink-400" />
              <h2 className="text-sm font-normal text-white">Mix Contenuti</h2>
            </div>
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={contentMixData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                    {contentMixData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(9,9,15,0.96)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {contentMixData.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-[11px] text-gray-400">{item.name} ({((item.value / data.posts) * 100).toFixed(0)}%)</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-normal text-white">Miglior Orario</h2>
            </div>
            <div className="flex flex-col items-center justify-center h-32 gap-2">
              <div className="text-3xl font-light text-white tracking-tight">{data.bestPostingTime}</div>
              <p className="text-xs text-gray-500">Orario consigliato per pubblicare</p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-400">Crescita Settimanale</span>
                <span className="text-green-400">+{data.growthRate}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Media Like/Post</span>
                <span className="text-white">{data.avgLikes.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-normal text-white">Top Post</h2>
              <p className="text-[11px] text-gray-500 mt-0.5">I 5 post con più interazioni</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 font-normal">Tipo</th>
                  <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 font-normal">Like</th>
                  <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 font-normal">Commenti</th>
                  <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 font-normal">Engagement</th>
                  <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider pb-3 font-normal">Data</th>
                </tr>
              </thead>
              <tbody>
                {data.topPosts.map((post, i) => {
                  const totalEngagement = ((post.likes + post.comments) / data.followers * 100).toFixed(1)
                  return (
                    <tr key={post.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 text-white">
                        <span className="inline-flex items-center gap-1.5">
                          {post.type === 'photo' ? <Camera className="w-4 h-4 text-orange-400" /> : post.type === 'video' ? <Film className="w-4 h-4 text-red-400" /> : <Images className="w-4 h-4 text-pink-400" />}
                          {post.type}
                        </span>
                      </td>
                      <td className="py-3 text-white">{post.likes.toLocaleString()}</td>
                      <td className="py-3 text-white">{post.comments.toLocaleString()}</td>
                      <td className="py-3"><span className="text-green-400">{totalEngagement}%</span></td>
                      <td className="py-3 text-gray-400 text-[11px]">{post.date}</td>
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
              <Heart className="w-4 h-4 text-red-400" />
              <h2 className="text-sm font-normal text-white">Interazioni Medie</h2>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topPosts} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="id" stroke="transparent" tick={{ fill: 'rgba(156,163,175,0.7)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="transparent" tick={{ fill: 'rgba(156,163,175,0.7)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(9,9,15,0.96)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Bar dataKey="likes" fill="#dc2743" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="comments" fill="#f09433" radius={[4, 4, 0, 0]} barSize={20} />
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
                <p className="text-sm text-white flex items-center gap-2"><Camera className="w-4 h-4 text-pink-400 flex-shrink-0" /> Il tuo engagement è del {engagementRate}%</p>
                <p className="text-xs text-gray-500 mt-1">{engagementRate > 4 ? 'Ottimo! Continua a pubblicare contenuti di qualità.' : 'Prova a utilizzare più Reel e contenuti interattivi per aumentare la reach organica.'}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-sm text-white flex items-center gap-2"><Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" /> Il momento migliore per pubblicare è {data.bestPostingTime}</p>
                <p className="text-xs text-gray-500 mt-1">I post pubblicati in questa fascia oraria ricevono in media più interazioni.</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-sm text-white flex items-center gap-2"><BarChart3 className="w-4 h-4 text-blue-400 flex-shrink-0" /> Mix di contenuti: {contentMixData[1].value > contentMixData[0].value ? 'I video dominano il tuo feed' : 'Le foto sono il tuo formato principale'}</p>
                <p className="text-xs text-gray-500 mt-1">Considera di alternare i formati per mantenere alto l'interesse del pubblico.</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-sm text-white flex items-center gap-2"><Target className="w-4 h-4 text-purple-400 flex-shrink-0" /> Copertura: {((data.reach / data.impressions) * 100).toFixed(0)}% delle impressioni sono utenti unici</p>
                <p className="text-xs text-gray-500 mt-1">Un buon rapporto copertura/impressioni indica contenuti che raggiungono nuovo pubblico.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
