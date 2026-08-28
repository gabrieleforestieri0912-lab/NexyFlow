/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, User, MessageSquare, Bell, Settings,
  CheckCircle, Info, AlertTriangle, AlertCircle, LayoutDashboard,
  ChevronDown, BarChart3, Target,
  HelpCircle, Mail, CreditCard, Zap, Layers, BookOpen, Link2
} from 'lucide-react'
import { TiktokIcon, InstagramIcon, YoutubeIcon } from '@/lib/icons'

interface Notification {
  id: string
  user_id: string
  text: string
  type: string
  read: boolean
  created_at: string
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const { user, loading } = useAuth()
  const { t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' }
      case 'warning': return { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' }
      case 'error': return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' }
      default: return { icon: Info, color: 'text-[#E4405F]', bg: 'bg-[#E4405F]/5' }
    }
  }

  const formatTime = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diff < 60) return t('common.now')
    if (diff < 3600) return `${Math.floor(diff / 60)}${t('common.minAgo')}`
    if (diff < 86400) return `${Math.floor(diff / 3600)}${t('common.hourAgo')}`
    return `${Math.floor(diff / 86400)}${t('common.dayAgo')}`
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLinks = [
    {
      label: t('landing.platformsTitle'), icon: Layers,
      items: [
        { label: t('analyze.instagram'), href: '/#platforms', icon: InstagramIcon, desc: t('analyze.subtitle') },
        { label: t('analyze.tiktok'), href: '/#platforms', icon: TiktokIcon, desc: t('landing.tiktokDesc') },
        { label: t('analyze.youtube'), href: '/#platforms', icon: YoutubeIcon, desc: t('landing.youtubeTitle') },
      ],
    },
    {
      label: t('help.categories.features'), icon: Zap,
      items: [
        { label: t('nav.chat'), href: '/#ai-chat', icon: MessageSquare, desc: t('chat.title') },
        { label: t('analytics.title'), href: '/#features', icon: BarChart3, desc: t('analytics.subtitle') },
        { label: t('strategy.title'), href: '/#how-it-works', icon: Target, desc: t('landing.strategyTitle') },
        { label: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard, desc: t('nav.dashboard') },
        { label: 'Integrazioni', href: '/integrazioni', icon: Link2, desc: 'Connetti i tuoi social' },
      ],
    },
    {
      label: t('landing.resourcesColumn'), icon: BookOpen,
      items: [
        { label: t('help.title'), href: '/help', icon: HelpCircle, desc: t('help.title') },
        { label: t('nav.contact'), href: '/contact', icon: Mail, desc: t('nav.contact') },
      ],
    },
    { label: t('nav.pricing'), href: '/#pricing', icon: CreditCard },
    ...(user ? [{ label: t('nav.chat'), href: '/chat', icon: MessageSquare }] : []),
  ]

  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const dropdownRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const anyOpen = Object.values(dropdownRefs.current).some(ref =>
        ref && ref.contains(event.target as Node)
      )
      if (!anyOpen) setActiveDropdown(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  const handleDropdownEnter = (idx: number) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setActiveDropdown(idx)
  }

  const handleDropdownLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
      closeTimeoutRef.current = null
    }, 150)
  }

  return (
    <>
      <nav className={`fixed z-50 transition-all duration-300 ease-out ${
        scrolled
          ? 'top-3 left-3 sm:left-4 right-3 sm:right-4 bg-white/70 backdrop-blur-[20px] rounded-2xl shadow-2xl shadow-gray-900/10 border border-white/40'
          : 'top-3 left-3 sm:left-4 right-3 sm:right-4 bg-white/40 backdrop-blur-[14px] rounded-2xl border border-white/50 shadow-lg shadow-gray-900/5'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img src="/nexyflow.png" alt="Nexyflow" className="w-8 h-8 rounded-lg object-contain" />
            <span className="text-xl font-normal text-gray-900">Nexyflow</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, idx) =>
              link.items ? (
                <div key={link.label} className="relative" ref={el => { dropdownRefs.current[idx] = el }}
                onMouseEnter={() => handleDropdownEnter(idx)}
                onMouseLeave={handleDropdownLeave}>
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === idx ? null : idx)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      activeDropdown === idx
                        ? 'text-[#E4405F] bg-[#E4405F]/5'
                        : 'text-gray-600 hover:text-[#E4405F] hover:bg-gray-50'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === idx ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeDropdown === idx && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        onMouseEnter={() => handleDropdownEnter(idx)}
                        onMouseLeave={handleDropdownLeave}
                        className="absolute left-0 mt-2 w-64 bg-white/70 backdrop-blur-[20px] rounded-2xl shadow-2xl shadow-gray-900/10 border border-white/40 py-2 origin-top-left"
                      >
                        {link.items.map(item => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                          >
                            <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-[#E4405F]/5 transition-colors">
                              <item.icon className="w-4 h-4 text-gray-500 group-hover:text-[#E4405F] transition-colors" />
                            </div>
                            <div>
                              <p className="text-sm font-normal text-gray-900 group-hover:text-[#E4405F] transition-colors">{item.label}</p>
                              <p className="text-xs text-gray-400">{item.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-[#E4405F] hover:bg-gray-50 transition-all"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {loading ? (
              <div className="w-20 h-10 bg-gray-100 animate-pulse rounded-full hidden md:block" />
            ) : user ? (
              <>
                {/* Notifications */}
                <div className="relative" ref={notificationsRef}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen)
                      if (!notificationsOpen) markAsRead()
                    }}
                    className="p-2 relative hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'text-[#E4405F]' : 'text-gray-500'}`} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                      </span>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {notificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-3 w-80 bg-white/70 backdrop-blur-[20px] rounded-2xl shadow-2xl shadow-gray-900/10 border border-white/40 overflow-hidden origin-top-right"
                      >
                        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                          <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-[#E4405F]" />
                            <p className="text-sm font-normal text-gray-900">{t('nav.notifications')}</p>
                            {unreadCount > 0 && (
                              <span className="text-[10px] font-normal text-white bg-[#E4405F] px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                            )}
                          </div>
                          {notifications.length > 0 && (
                            <button onClick={() => setNotificationsOpen(false)} className="text-[10px] font-normal text-[#E4405F] hover:underline">{t('common.close')}</button>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                          {notifications.length > 0 ? (
                            notifications.map(n => {
                              const { icon: Icon, color, bg } = getNotificationIcon(n.type)
                              return (
                                <div key={n.id} className={`px-5 py-3.5 hover:bg-gray-50 ${!n.read ? 'bg-gradient-to-r from-[#E4405F]/[0.03] to-transparent' : ''}`}>
                                  <div className="flex gap-3">
                                    <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                                      <Icon className={`w-4 h-4 ${color}`} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className={`text-sm leading-snug ${!n.read ? 'font-normal text-gray-900' : 'text-gray-600'}`}>{n.text}</p>
                                      <div className="flex items-center gap-2 mt-1.5">
                                        <p className="text-[11px] text-gray-400 font-medium">{formatTime(n.created_at)}</p>
                                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#E4405F]" />}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })
                          ) : (
                            <div className="px-5 py-12 text-center">
                              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                                <Bell className="w-6 h-6 text-gray-300" />
                              </div>
                              <p className="text-sm font-normal text-gray-900 mb-1">{t('nav.noNotifications')}</p>
                              <p className="text-xs text-gray-400">{t('nav.notificationsSubtext')}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Avatar Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors group"
                  >
                    <div className={`w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-[#f09433] to-[#dc2743] flex items-center justify-center text-white ring-2 transition-all duration-300 ${dropdownOpen ? 'ring-[#E4405F]/60 shadow-[0_0_12px_rgba(228,64,95,0.35)]' : 'ring-transparent group-hover:ring-[#E4405F]/30 group-hover:shadow-[0_0_12px_rgba(228,64,95,0.35)]'}`}>
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                      )}
                    </div>
                  </motion.button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white/70 backdrop-blur-[20px] rounded-xl shadow-lg shadow-gray-900/10 border border-white/40 py-2 origin-top-right"
                      >
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>

                        <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 font-medium text-sm">
                          <LayoutDashboard className="w-4 h-4" /> {t('nav.dashboard')}
                        </Link>

                        <Link href="/chat" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 font-medium text-sm">
                          <MessageSquare className="w-4 h-4" /> {t('nav.chat')}
                        </Link>

                        <Link href="/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 font-medium text-sm">
                          <Settings className="w-4 h-4" /> {t('nav.settings') || 'Impostazioni'}
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <div className="hidden md:flex items-center space-x-4">
                  <Link href="/login" className="px-5 py-2 text-gray-700 font-medium">{t('nav.login')}</Link>
                  <Link href="/register">
                    <motion.button whileTap={{ scale: 0.95 }} className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all">
                      {t('pricing.startFree')}
                    </motion.button>
                  </Link>
                </div>
                <div className="md:hidden">
                  <Link href="/login" className="px-3 py-2 text-sm text-gray-700 font-medium">{t('nav.login')}</Link>
                </div>
              </>
            )}

            {/* Hamburger */}
            <button className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      </nav>

      {/* Slide-in Menu (Terranova style) */}
      <div className={`menu-overlay ${isOpen ? 'is-open' : ''}`} id="menu" aria-hidden={!isOpen}>
        <div className="menu-overlay__backdrop" onClick={() => setIsOpen(false)} />
        <div className="menu-overlay__panel">
          <button className="menu-overlay__close" onClick={() => setIsOpen(false)} aria-label={t('common.close')}>
            <svg className="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
            <span>{t('common.close')}</span>
          </button>

          <nav className="menu-overlay__nav">
            {navLinks.map(link =>
              link.items ? (
                <div key={link.label}>
                  <span className="menu-overlay__link">
                    <span className="menu-overlay__linkText">{link.label}</span>
                    <svg className="menu-overlay__arrow icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </svg>
                  </span>
                  {link.items.map(item => (
                    <Link key={item.label} href={item.href} onClick={() => setIsOpen(false)}
                      className="block pl-7 py-1.5 text-sm text-white/60 hover:text-[#f09433] transition-colors">
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link key={link.label} href={link.href} onClick={() => setIsOpen(false)} className="menu-overlay__link">
                  <span className="menu-overlay__linkText">{link.label}</span>
                  <svg className="menu-overlay__arrow icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              )
            )}
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="menu-overlay__link">
                  <span className="menu-overlay__linkText">{t('nav.dashboard')}</span>
                  <svg className="menu-overlay__arrow icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/settings" onClick={() => setIsOpen(false)} className="menu-overlay__link">
                  <span className="menu-overlay__linkText">{t('nav.settings') || 'Impostazioni'}</span>
                  <svg className="menu-overlay__arrow icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)} className="menu-overlay__link">
                  <span className="menu-overlay__linkText">{t('nav.login')}</span>
                  <svg className="menu-overlay__arrow icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="menu-overlay__link">
                  <span className="menu-overlay__linkText">{t('pricing.startFree')}</span>
                  <svg className="menu-overlay__arrow icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </>
            )}
          </nav>

          <div className="menu-overlay__foot">
            <span className="menu-overlay__label">Get in touch</span>
            <a className="menu-overlay__mail" href="mailto:hello@nexyflow.it">hello@nexyflow.it</a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
