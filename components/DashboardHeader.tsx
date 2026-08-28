'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Search, ChevronRight, Home, CheckCircle, Info, AlertTriangle, AlertCircle, Command } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface Notification {
  id: string
  user_id: string
  text: string
  type: string
  read: boolean
  created_at: string
}

const CRUMBS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/analytics/instagram': 'Analytics Instagram',
  '/dashboard/analytics/tiktok': 'Analytics TikTok',
  '/dashboard/analytics/youtube': 'Analytics YouTube',
  '/dashboard/strategy': 'Strategia',
  '/dashboard/connect': 'Connetti',
  '/dashboard/analyze': 'Analizza Profilo',
  '/dashboard/auto-content': 'Piano Editoriale AI',
  '/dashboard/tools/content-generator': 'Content Generator',
  '/dashboard/tools': 'Strumenti AI',
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'success': return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/15' }
    case 'warning': return { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/15' }
    case 'error': return { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/15' }
    default: return { icon: Info, color: 'text-[#E4405F]', bg: 'bg-[#E4405F]/15' }
  }
}

function formatTime(dateString: string) {
  const now = new Date()
  const date = new Date(dateString)
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return 'ora'
  if (diff < 3600) return `${Math.floor(diff / 60)} min fa`
  if (diff < 86400) return `${Math.floor(diff / 3600)} h fa`
  return `${Math.floor(diff / 86400)} g fa`
}

export default function DashboardHeader() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const notificationsRef = useRef<HTMLDivElement>(null)

  const crumbLabel = CRUMBS[pathname] || pathname.split('/').filter(Boolean).pop() || 'Dashboard'

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setNotifications(data)
        setUnreadCount(data.filter((n: Notification) => !n.read).length)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const markAsRead = async () => {
    if (unreadCount === 0) return
    try {
      const res = await fetch('/api/notifications', { method: 'PUT' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setUnreadCount(0)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 60000)
      return () => clearInterval(interval)
    }
  }, [user])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const openCommandPalette = useCallback(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, metaKey: true, bubbles: true }))
  }, [])

  return (
    <header className="sticky top-0 z-20 bg-[#0a0a12] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Breadcrumb / page title */}
        <div className="flex items-center gap-2 min-w-0">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-gray-500 hover:text-white transition-colors flex-shrink-0" title="Home">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
          <h1 className="text-base font-normal text-white truncate">{crumbLabel}</h1>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Search / Command palette trigger */}
          <button
            onClick={openCommandPalette}
            className="flex items-center gap-2 px-3.5 h-10 rounded-xl bg-white/5 border border-white/8 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E4405F]/50 focus-visible:border-[#E4405F]/40 focus-visible:bg-white/[0.08] active:scale-[0.98] transition-all text-sm w-48 sm:w-56"
          >
            <Search className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Cerca o naviga...</span>
            <kbd className="ml-auto hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white/8 rounded-md text-[10px] text-gray-500">
              <Command size={10} />K
            </kbd>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen)
                if (!notificationsOpen) markAsRead()
              }}
              className="relative p-2.5 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 hover:border-white/15 transition-all text-gray-400 hover:text-white"
            >
              <Bell className={`w-[18px] h-[18px] ${unreadCount > 0 ? 'text-[#E4405F]' : ''}`} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
              )}
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-80 bg-[#11111b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden origin-top-right"
                >
                  <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#E4405F]" />
                      <p className="text-sm font-normal text-white">Notifiche</p>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-normal text-white bg-[#E4405F] px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <button onClick={() => setNotificationsOpen(false)} className="text-[10px] font-normal text-[#E4405F] hover:underline">Chiudi</button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                    {notifications.length > 0 ? (
                      notifications.map(n => {
                        const { icon: Icon, color, bg } = getNotificationIcon(n.type)
                        return (
                          <div key={n.id} className={`px-5 py-3.5 hover:bg-white/5 ${!n.read ? 'bg-gradient-to-r from-[#E4405F]/[0.06] to-transparent' : ''}`}>
                            <div className="flex gap-3">
                              <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                                <Icon className={`w-4 h-4 ${color}`} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className={`text-sm leading-snug ${!n.read ? 'font-normal text-white' : 'text-gray-400'}`}>{n.text}</p>
                                <div className="flex items-center gap-2 mt-1.5">
                                  <p className="text-[11px] text-gray-500 font-medium">{formatTime(n.created_at)}</p>
                                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#E4405F]" />}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="px-5 py-12 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                          <Bell className="w-6 h-6 text-gray-600" />
                        </div>
                        <p className="text-sm font-normal text-white mb-1">Nessuna notifica</p>
                        <p className="text-xs text-gray-500">Le novità appariranno qui.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}
