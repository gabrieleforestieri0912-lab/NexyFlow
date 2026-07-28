'use client'

import { useState, useEffect } from 'react'
import { Link2, Unlink, Loader2, CheckCircle, X } from 'lucide-react'
import { YoutubeIcon, TiktokIcon, InstagramIcon } from '@/lib/icons'
import { motion, AnimatePresence } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'

type Platform = 'instagram' | 'tiktok' | 'youtube'

interface PlatformConfig {
  id: Platform
  name: string
  icon: any
  color: string
  gradient: string
}

interface ConnectData {
  connectedPlatforms: Record<string, boolean>
  socialStats: Record<string, any>
}

const platforms: PlatformConfig[] = [
  { id: 'instagram', name: 'Instagram', icon: InstagramIcon, color: 'from-pink-500 to-purple-500', gradient: 'from-[#f09433] via-[#dc2743] to-[#bc1888]' },
  { id: 'tiktok', name: 'TikTok', icon: TiktokIcon, color: 'from-zinc-900 to-black', gradient: 'from-zinc-900 to-black' },
  { id: 'youtube', name: 'YouTube', icon: YoutubeIcon, color: 'from-red-600 to-red-800', gradient: 'from-[#FF0000] to-[#c4302b]' },
]

export default function ConnectPage() {
  const [data, setData] = useState<ConnectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null)
  const [showModal, setShowModal] = useState<Platform | null>(null)
  const [username, setUsername] = useState('')

  useEffect(() => {
    fetchConnections()
  }, [])

  async function fetchConnections() {
    try {
      const res = await fetch('/api/connect')
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error('Failed to fetch connections:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleConnect(platform: Platform) {
    setConnecting(platform)
    try {
      const res = await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, action: 'connect', username }),
      })
      const json = await res.json()
      if (res.ok) {
        if (json.redirect) {
          window.location.href = json.redirect
          return
        }
        setData({ connectedPlatforms: json.connectedPlatforms, socialStats: json.socialStats })
        setShowModal(null)
        setUsername('')
      } else {
        alert(json.error)
      }
    } catch (err) {
      console.error('Connect error:', err)
    } finally {
      setConnecting(null)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const igStatus = params.get('instagram')
    if (igStatus === 'success') {
      fetchConnections()
      window.history.replaceState({}, '', '/dashboard/connect')
    } else if (igStatus === 'error') {
      alert('Connessione Instagram fallita. Riprova.')
      window.history.replaceState({}, '', '/dashboard/connect')
    }
  }, [])

  async function handleDisconnect(platform: Platform) {
    setConnecting(platform)
    try {
      const res = await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, action: 'disconnect' }),
      })
      const json = await res.json()
      if (res.ok) {
        setData({ connectedPlatforms: json.connectedPlatforms, socialStats: json.socialStats })
      }
    } catch (err) {
      console.error('Disconnect error:', err)
    } finally {
      setConnecting(null)
    }
  }

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
        <div>
          <h1 className="text-3xl font-normal text-white tracking-tight">Connetti Piattaforme</h1>
          <p className="text-gray-400 mt-1">Collega i tuoi profili social per abilitare le analisi e sbloccare la generazione di strategie basate sull'AI</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {platforms.map((platform) => {
            const isConnected = data?.connectedPlatforms?.[platform.id] || false
            const stats = data?.socialStats?.[platform.id]

            return (
              <div
                key={platform.id}
                className={`bg-white/[0.04] backdrop-blur-[12px] border rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between min-h-[280px] ${
                  isConnected ? 'border-green-500/25 bg-green-500/[0.02]' : 'border-white/5 hover:border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center shadow-lg shadow-black/30`}>
                      <platform.icon className="w-7 h-7 text-white" />
                    </div>
                    {isConnected && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/25 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-[11px] font-normal text-green-400 tracking-wide uppercase">Connesso</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-normal text-white mb-2">{platform.name}</h3>

                  {isConnected && stats ? (
                    <div className="space-y-1 mb-6">
                      <p className="text-sm text-gray-300 font-medium">
                        {(stats.followers || stats.subscribers || 0).toLocaleString()} {platform.id === 'youtube' ? 'iscritti' : 'follower'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {stats.views ? `${stats.views.toLocaleString()} visualizzazioni` : ''} • {stats.engagement}% engagement
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 mb-6 leading-relaxed">Connetti il tuo profilo {platform.name} per importare follower, visualizzazioni e attivare i report automatizzati.</p>
                  )}
                </div>

                <div>
                  {isConnected ? (
                    <button
                      onClick={() => handleDisconnect(platform.id)}
                      disabled={connecting === platform.id}
                      className="w-full py-3 rounded-xl border border-red-500/20 text-red-400 font-normal text-sm hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {connecting === platform.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlink className="w-4 h-4" />}
                      Disconnetti account
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowModal(platform.id)}
                      disabled={connecting === platform.id}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-medium text-sm hover:opacity-90 active:scale-[0.98] shadow-lg shadow-red-500/10 hover:shadow-red-500/20 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {connecting === platform.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                      Connetti {platform.name}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
              onClick={() => setShowModal(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#0f0f18] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Decorative glow */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#dc2743]/10 blur-[50px] rounded-full pointer-events-none" />
                
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <h3 className="text-lg font-normal text-white">Connetti {platforms.find(p => p.id === showModal)?.name}</h3>
                  <button onClick={() => setShowModal(null)} className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="relative z-10 space-y-4">
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Inserisci il tuo username o l'identificativo del canale per consentire all'AI di sincronizzare e analizzare le tue metriche storiche.
                  </p>
                  
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={`Esempio: @username o nome canale`}
                    onKeyDown={(e) => e.key === 'Enter' && handleConnect(showModal)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-[#dc2743] focus:ring-2 focus:ring-[#dc2743]/20 outline-none transition-all text-sm"
                  />
                  
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowModal(null)}
                      className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 font-normal text-sm hover:bg-white/5 transition-colors"
                    >
                      Annulla
                    </button>
                    <button
                      onClick={() => handleConnect(showModal)}
                      disabled={!username.trim()}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-medium text-sm disabled:opacity-50 transition-opacity"
                    >
                      Connetti Ora
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  )
}
