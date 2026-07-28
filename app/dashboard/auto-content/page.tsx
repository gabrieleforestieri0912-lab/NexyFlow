'use client'

import { useState, useEffect } from 'react'
import { Calendar, Sparkles, Loader2, RefreshCw, Check, X, Clock, ChevronLeft, ChevronRight, Video, Image, Music, MessageCircle, ThumbsUp, CheckCircle, AlertCircle } from 'lucide-react'
import { YoutubeIcon, InstagramIcon, TiktokIcon } from '@/lib/icons'
import ProtectedRoute from '@/components/ProtectedRoute'

interface Post {
  id: string
  platform: string
  type: string
  title: string
  caption: string
  hashtags: string
  scheduledTime: string
  status: string
}

interface DaySchedule {
  day: string
  posts: Post[]
}

interface ContentPlan {
  schedule: DaySchedule[]
  summary: {
    totalPosts: number
    platforms: { name: string; postsCount: number; bestTime: string }[]
  }
  generatedAt: string
}

const platformConfig: Record<string, { icon: any; gradient: string; label: string }> = {
  instagram: { icon: InstagramIcon, gradient: 'from-[#f09433] via-[#dc2743] to-[#bc1888]', label: 'Instagram' },
  tiktok: { icon: TiktokIcon, gradient: 'from-zinc-900 to-black', label: 'TikTok' },
  youtube: { icon: YoutubeIcon, gradient: 'from-red-600 to-red-800', label: 'YouTube' },
}

const statusColors: Record<string, string> = {
  draft: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  approved: 'bg-green-500/10 text-green-400 border-green-500/20',
  published: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
}

const typeIcons: Record<string, any> = {
  Reel: Video, Carosello: Image, Foto: Image, Video: Video,
  Tutorial: Video, Recensione: MessageCircle, 'Q&A': MessageCircle,
  Vlog: Video, Educational: Video, 'Case Study': ThumbsUp,
  Anteprima: Sparkles, Trend: Music, Challenge: Sparkles,
  Storytime: Music, Duetto: Music,
}

export default function AutoContentPage() {
  const [plan, setPlan] = useState<ContentPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [currentDayIndex, setCurrentDayIndex] = useState(0)
  const [approvedPosts, setApprovedPosts] = useState<Set<string>>(new Set())
  const [publishedPosts, setPublishedPosts] = useState<Set<string>>(new Set())
  const [filterPlatform, setFilterPlatform] = useState<string>('all')
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => { generatePlan() }, [])

  async function generatePlan(regenerate = false) {
    if (regenerate) setGenerating(true)
    try {
      const res = await fetch('/api/auto-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regenerate }),
      })
      const json = await res.json()
      if (json.limitReached) {
        setPlan(null)
        return
      }
      setPlan(json)
      setApprovedPosts(new Set())
      setPublishedPosts(new Set())
      setCurrentDayIndex(0)
    } catch (err) {
      console.error('Failed to generate content plan:', err)
    } finally {
      setLoading(false)
      setGenerating(false)
    }
  }

  function toggleApprove(postId: string) {
    setApprovedPosts(prev => {
      const next = new Set(prev)
      if (next.has(postId)) next.delete(postId)
      else next.add(postId)
      return next
    })
  }

  function publishApproved() {
    setPublishedPosts(new Set([...approvedPosts]))
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  if (loading) return (
    <ProtectedRoute><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-[#dc2743]" /></div></ProtectedRoute>
  )

  const currentDay = plan?.schedule?.[currentDayIndex]
  const filteredPosts = currentDay?.posts.filter(p => filterPlatform === 'all' || p.platform === filterPlatform) || []
  const approvedCount = approvedPosts.size
  const totalApprovable = plan?.schedule?.reduce((a, d) => a + d.posts.length, 0) || 0

  return (
    <ProtectedRoute>
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shadow-lg shadow-red-500/20">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-normal text-white tracking-tight">Piano Editoriale AI</h1>
              <p className="text-sm text-gray-500">Calendario contenuti automatico generato dall'intelligenza artificiale</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {approvedCount > 0 && (
              <button
                onClick={publishApproved}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-green-500/20"
              >
                <CheckCircle className="w-4 h-4" />
                Pubblica ({approvedCount})
              </button>
            )}
            <button
              onClick={() => generatePlan(true)}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white text-sm font-medium hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-red-500/10"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {generating ? 'Generazione...' : 'Rigenera'}
            </button>
          </div>
        </div>

        {plan?.summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
              <p className="text-2xl font-normal text-white tracking-tight">{plan.summary.totalPosts}</p>
              <p className="text-xs text-gray-500 mt-0.5">Contenuti Totali</p>
            </div>
            {plan.summary.platforms.map((p) => (
              <div key={p.name} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  {(() => {
                    const Icon = platformConfig[p.name]?.icon
                    return Icon ? <Icon className="w-4 h-4" /> : null
                  })()}
                  <p className="text-lg font-normal text-white tracking-tight">{p.postsCount}</p>
                </div>
                <p className="text-xs text-gray-500 capitalize">{p.name}</p>
                <p className="text-[10px] text-gray-600 mt-0.5">Miglior orario: {p.bestTime}</p>
              </div>
            ))}
          </div>
        )}

        {showSuccess && (
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm animate-[fadeInUp_0.3s_ease_both]">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            Contenuti pubblicati con successo! {approvedCount} post sono ora in coda.
          </div>
        )}

        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentDayIndex(Math.max(0, currentDayIndex - 1))}
                disabled={currentDayIndex === 0}
                className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h2 className="text-base font-normal text-white min-w-[120px] text-center">
                {currentDay?.day || 'Caricamento...'}
              </h2>
              <button
                onClick={() => setCurrentDayIndex(Math.min((plan?.schedule?.length || 1) - 1, currentDayIndex + 1))}
                disabled={currentDayIndex >= (plan?.schedule?.length || 1) - 1}
                className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-1 bg-white/5 rounded-lg p-1">
              <button onClick={() => setFilterPlatform('all')} className={`px-3 py-1.5 rounded-md text-xs transition-all ${filterPlatform === 'all' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>Tutti</button>
              {['instagram', 'tiktok', 'youtube'].map(p => (
                <button key={p} onClick={() => setFilterPlatform(p)} className={`px-3 py-1.5 rounded-md text-xs capitalize transition-all ${filterPlatform === p ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>{p}</button>
              ))}
            </div>
          </div>

          <div className="p-4 space-y-3">
            {filteredPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Calendar className="w-10 h-10 mb-2 opacity-50" />
                <p className="text-sm">Nessun contenuto per questa giornata</p>
              </div>
            ) : (
              filteredPosts.map((post) => {
                const cfg = platformConfig[post.platform]
                const Icon = cfg?.icon
                const TypeIcon = typeIcons[post.type] || Video
                const isApproved = approvedPosts.has(post.id)
                const isPublished = publishedPosts.has(post.id)

                return (
                  <div
                    key={post.id}
                    className={`rounded-2xl border transition-all duration-200 ${
                      isPublished
                        ? 'bg-blue-500/5 border-blue-500/20 opacity-60'
                        : isApproved
                          ? 'bg-green-500/5 border-green-500/20'
                          : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/10'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cfg?.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                            {Icon && <Icon className="w-5 h-5 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-sm font-normal text-white truncate">{post.title}</span>
                              <span className={`text-[10px] font-normal px-2 py-0.5 rounded-full border ${statusColors[isPublished ? 'published' : isApproved ? 'approved' : 'draft']}`}>
                                {isPublished ? 'Pubblicato' : isApproved ? 'Approvato' : 'Bozza'}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                              <span className="flex items-center gap-1 capitalize"><TypeIcon className="w-3 h-3" /> {post.type}</span>
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.scheduledTime}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-2">{post.caption}</p>
                            {post.hashtags && (
                              <p className="text-[11px] text-cyan-400/70 mt-1 truncate">{post.hashtags}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {!isPublished && (
                            <button
                              onClick={() => toggleApprove(post.id)}
                              className={`p-2 rounded-lg border transition-all ${
                                isApproved
                                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                  : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              {isApproved ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {plan?.schedule && (
            <div className="flex items-center justify-between p-4 border-t border-white/[0.06]">
              <span className="text-xs text-gray-500">
                Giorno {currentDayIndex + 1} di {plan.schedule.length}
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-gray-500">Approvati: <span className="text-green-400">{approvedPosts.size}</span></span>
                  <span className="text-gray-500">Totali: <span className="text-white">{totalApprovable}</span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {!plan && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/[0.08] flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-normal text-white">Nessuna piattaforma connessa</h3>
            <p className="text-sm text-gray-500 text-center max-w-md">Collega almeno un profilo social per generare automaticamente un piano editoriale personalizzato.</p>
            <button onClick={() => window.location.href = '/dashboard/connect'} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white text-sm">Connetti Piattaforme</button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
