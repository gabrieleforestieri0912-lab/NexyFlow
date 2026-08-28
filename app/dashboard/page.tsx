'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Users, Eye, TrendingUp, Video, Link2, Sparkles, ArrowUp, Loader2, CheckCircle, BarChart3, ChevronRight, ArrowRight, Heart, MessageCircle } from 'lucide-react'
import { YoutubeIcon, TiktokIcon, InstagramIcon } from '@/lib/icons'
import ProtectedRoute from '@/components/ProtectedRoute'
import AnalyticsChart from '@/components/AnalyticsChart'
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'

interface DashboardData {
  totalFollowers: number
  totalViews: number
  avgEngagement: number
  totalVideos: number
  totalLikes: number
  totalComments: number
  history: { name: string; followers: number; views: number }[]
  platforms: Record<string, { connected: boolean; stats: any }>
}

const DEFAULT_DAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']

const zeroHistory = DEFAULT_DAYS.map((name) => ({ name, followers: 0, views: 0 }))

// Mini sparkline component
function Sparkline({ data, dataKey, color }: { data: any[]; dataKey: string; color: string }) {
  if (!data || data.length === 0) return null
  return (
    <div className="w-full h-12 opacity-60 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`spark-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{ display: 'none' }}
            cursor={false}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={1.5}
            fillOpacity={1}
            fill={`url(#spark-${dataKey})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [chartMode, setChartMode] = useState<'followers' | 'views'>('followers')

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (sessionId) {
      verifySession(sessionId)
    }
    fetchAnalytics()
  }, [])

  async function verifySession(sessionId: string) {
    try {
      await fetch('/api/checkout/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
    } catch (err) {
      console.error('Session verification failed:', err)
    }
  }

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
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-red-400" />
          <p className="text-gray-500 text-sm">Caricamento dati...</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      label: 'Follower Totali',
      value: data?.totalFollowers?.toLocaleString() || '0',
      icon: Users,
      change: '+12%',
      cardClass: 'bg-[rgba(220,39,67,0.08)] border-[rgba(220,39,67,0.2)] hover:bg-[rgba(220,39,67,0.12)] hover:border-[rgba(220,39,67,0.35)] hover:shadow-[0_0_30px_rgba(220,39,67,0.12),0_20px_40px_-20px_rgba(0,0,0,0.4)]',
      iconColor: '#dc2743',
      iconBg: 'rgba(220,39,67,0.15)',
      sparkColor: '#dc2743',
      sparkKey: 'followers',
    },
    {
      label: 'Visualizzazioni',
      value: data?.totalViews?.toLocaleString() || '0',
      icon: Eye,
      change: '+8%',
      cardClass: 'bg-[rgba(139,92,246,0.08)] border-[rgba(139,92,246,0.2)] hover:bg-[rgba(139,92,246,0.12)] hover:border-[rgba(139,92,246,0.35)] hover:shadow-[0_0_30px_rgba(139,92,246,0.12),0_20px_40px_-20px_rgba(0,0,0,0.4)]',
      iconColor: '#8b5cf6',
      iconBg: 'rgba(139,92,246,0.15)',
      sparkColor: '#8b5cf6',
      sparkKey: 'views',
    },
    {
      label: 'Engagement Medio',
      value: `${data?.avgEngagement || 0}%`,
      icon: TrendingUp,
      change: '+2.5%',
      cardClass: 'bg-[rgba(240,148,51,0.08)] border-[rgba(240,148,51,0.2)] hover:bg-[rgba(240,148,51,0.12)] hover:border-[rgba(240,148,51,0.35)] hover:shadow-[0_0_30px_rgba(240,148,51,0.12),0_20px_40px_-20px_rgba(0,0,0,0.4)]',
      iconColor: '#f09433',
      iconBg: 'rgba(240,148,51,0.15)',
      sparkColor: '#f09433',
      sparkKey: 'followers',
    },
    {
      label: 'Contenuti',
      value: data?.totalVideos?.toLocaleString() || '0',
      icon: Video,
      change: '+5%',
      cardClass: 'bg-[rgba(6,182,212,0.08)] border-[rgba(6,182,212,0.2)] hover:bg-[rgba(6,182,212,0.12)] hover:border-[rgba(6,182,212,0.35)] hover:shadow-[0_0_30px_rgba(6,182,212,0.12),0_20px_40px_-20px_rgba(0,0,0,0.4)]',
      iconColor: '#06b6d4',
      iconBg: 'rgba(6,182,212,0.15)',
      sparkColor: '#06b6d4',
      sparkKey: 'views',
    },
    {
      label: 'Mi Piace',
      value: data?.totalLikes?.toLocaleString() || '0',
      icon: Heart,
      change: '+9%',
      cardClass: 'bg-[rgba(239,68,68,0.08)] border-[rgba(239,68,68,0.2)] hover:bg-[rgba(239,68,68,0.12)] hover:border-[rgba(239,68,68,0.35)] hover:shadow-[0_0_30px_rgba(239,68,68,0.12),0_20px_40px_-20px_rgba(0,0,0,0.4)]',
      iconColor: '#ef4444',
      iconBg: 'rgba(239,68,68,0.15)',
      sparkColor: '#ef4444',
      sparkKey: 'views',
    },
    {
      label: 'Commenti',
      value: data?.totalComments?.toLocaleString() || '0',
      icon: MessageCircle,
      change: '+4%',
      cardClass: 'bg-[rgba(249,115,22,0.08)] border-[rgba(249,115,22,0.2)] hover:bg-[rgba(249,115,22,0.12)] hover:border-[rgba(249,115,22,0.35)] hover:shadow-[0_0_30px_rgba(249,115,22,0.12),0_20px_40px_-20px_rgba(0,0,0,0.4)]',
      iconColor: '#f97316',
      iconBg: 'rgba(249,115,22,0.15)',
      sparkColor: '#f97316',
      sparkKey: 'views',
    },
  ]

  const platformConfig = {
    instagram: { icon: InstagramIcon, gradient: 'from-[#f09433] via-[#dc2743] to-[#bc1888]' },
    tiktok: { icon: TiktokIcon, gradient: 'from-zinc-900 to-black' },
    youtube: { icon: YoutubeIcon, gradient: 'from-red-600 to-red-800' },
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-[fadeInUp_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
          <div>
            <h1 className="text-2xl font-normal text-white tracking-tight">
              Ciao, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-gray-500 mt-0.5 text-sm">Ecco le tue performance oggi.</p>
          </div>
          <div className="flex items-center gap-3">
            {searchParams.get('success') && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm">
                <CheckCircle className="w-4 h-4" />
                Pagamento completato!
              </div>
            )}
            <button
              onClick={() => router.push('/dashboard/analytics')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 text-gray-300 text-sm hover:bg-white/5 hover:text-white active:scale-95 transition-all"
            >
              Analisi dettagliate
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`${stat.cardClass} rounded-2xl p-5 cursor-default backdrop-blur-sm transition-all duration-300`}
              style={{ animation: `fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both ${(i + 1) * 0.05}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: stat.iconBg }}
                >
                  <stat.icon className="w-4 h-4" style={{ color: stat.iconColor }} />
                </div>
                <span
                  className="flex items-center gap-1 text-xs font-normal px-2 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(34,197,94,0.12)',
                    color: '#4ade80',
                  }}
                >
                  <ArrowUp className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-normal text-white tracking-tight">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              <Sparkline
                data={data?.history?.length ? data.history : zeroHistory}
                dataKey={stat.sparkKey}
                color={stat.sparkColor}
              />
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl backdrop-blur-[12px] transition-all duration-200 hover:bg-white/[0.07] hover:border-white/[0.14] hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 p-6" style={{ animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both 0.25s' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-normal text-white">Andamento</h2>
              <p className="text-xs text-gray-500 mt-0.5">Ultimi 7 giorni</p>
            </div>
            <div className="flex gap-1 bg-white/5 rounded-lg p-1 border border-white/8">
              <button
                onClick={() => setChartMode('followers')}
                className={`px-3 py-1.5 rounded-md text-xs font-normal transition-all ${
                  chartMode === 'followers'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Follower
              </button>
              <button
                onClick={() => setChartMode('views')}
                className={`px-3 py-1.5 rounded-md text-xs font-normal transition-all ${
                  chartMode === 'views'
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Views
              </button>
            </div>
          </div>
          <div className="h-[260px]">
            <AnalyticsChart data={data?.history?.length ? data.history : zeroHistory} mode={chartMode} />
          </div>
        </div>

        {/* Platforms + Quick Actions */}
        <div className="grid lg:grid-cols-2 gap-4" style={{ animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both 0.3s' }}>
          {/* Platforms */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl backdrop-blur-[12px] transition-all duration-200 hover:bg-white/[0.07] hover:border-white/[0.14] hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 p-5">
            <h2 className="text-sm font-normal text-white mb-4">Piattaforme Collegate</h2>
            <div className="space-y-2.5">
              {['instagram', 'tiktok', 'youtube'].map((platform) => {
                const p = data?.platforms?.[platform]
                const isConnected = p?.connected
                const cfg = platformConfig[platform as keyof typeof platformConfig]
                return (
                  <button
                    key={platform}
                    onClick={() => isConnected && router.push(`/dashboard/analytics/${platform}`)}
                    disabled={!isConnected}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isConnected
                        ? 'bg-green-500/5 border-green-500/15 hover:bg-green-500/10 hover:border-green-500/25 cursor-pointer'
                        : 'bg-white/3 border-white/6 cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center`}>
                        <cfg.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-normal text-sm text-white capitalize">{platform}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-normal px-2.5 py-1 rounded-full ${
                          isConnected
                            ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                            : 'bg-white/8 text-gray-500 border border-white/8'
                        }`}
                      >
                        {isConnected ? '● Connesso' : '○ Non connesso'}
                      </span>
                      {isConnected && <ChevronRight className="w-3.5 h-3.5 text-gray-500" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl backdrop-blur-[12px] transition-all duration-200 hover:bg-white/[0.07] hover:border-white/[0.14] hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 p-5">
            <h2 className="text-sm font-normal text-white mb-4">Azioni Rapide</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'Analisi Rapida', sub: 'Analizza un profilo', icon: Sparkles, color: '#dc2743', bg: 'rgba(220,39,67,0.08)', border: 'rgba(220,39,67,0.2)', path: '/dashboard/analyze' },
                { label: 'Connetti', sub: 'Aggiungi piattaforma', icon: Link2, color: '#06b6d4', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.2)', path: '/dashboard/connect' },
                { label: 'Strategia', sub: 'Piano di crescita', icon: BarChart3, color: '#f09433', bg: 'rgba(240,148,51,0.08)', border: 'rgba(240,148,51,0.2)', path: '/dashboard/strategy' },
                { label: 'Contenuti', sub: 'Genera con AI', icon: Video, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)', path: '/dashboard/tools/content-generator' },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => router.push(action.path)}
                  className="p-4 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: action.bg, border: `1px solid ${action.border}` }}
                >
                  <action.icon className="w-5 h-5 mb-2" style={{ color: action.color }} />
                  <p className="font-normal text-white text-xs leading-tight">{action.label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{action.sub}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Upgrade banner */}
        {(!user?.plan || user.plan === 'free') && (
          <div className="relative overflow-hidden rounded-2xl border border-[#dc2743]/20 p-6" style={{ animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-[#f09433]/8 via-[#dc2743]/8 to-[#bc1888]/8" />
            <div className="absolute inset-0 opacity-[0.02] will-change-transform" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'1\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-base font-normal text-white mb-0.5 flex items-center gap-2">Passa al Piano Pro <Sparkles className="w-4 h-4 text-[#f09433]" /></h3>
                <p className="text-gray-400 text-sm">Sblocca query AI illimitate e analisi avanzate.</p>
              </div>
              <button
                onClick={() => router.push('/pricing')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-medium text-sm hover:opacity-90 hover:shadow-lg hover:shadow-red-500/20 transition-all flex-shrink-0"
              >
                Aggiorna ora
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
