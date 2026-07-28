'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  LayoutDashboard, BarChart3, Lightbulb, FileText,
  Link2, Sparkles, Settings, CreditCard, LogOut, Cpu, Calendar
} from 'lucide-react'
import Image from 'next/image'

const mainNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#dc2743' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3, color: '#8b5cf6' },
  { href: '/dashboard/strategy', label: 'Strategia', icon: Lightbulb, color: '#f09433' },
  { href: '/dashboard/connect', label: 'Connetti', icon: Link2, color: '#06b6d4' },
]

const aiNav = [
  { href: '/dashboard/analyze', label: 'Analizza Profilo', icon: Sparkles, color: '#dc2743' },
  { href: '/dashboard/auto-content', label: 'Piano Editoriale AI', icon: Calendar, color: '#22c55e' },
  { href: '/dashboard/tools/content-generator', label: 'Content Generator', icon: FileText, color: '#f09433' },
]

const bottomNav = [
  { href: '/pricing', label: 'Piani & Prezzi', icon: CreditCard, color: '#8b5cf6' },
  { href: '/settings', label: 'Impostazioni', icon: Settings, color: '#6b7280' },
]

function NavItem({ href, label, icon: Icon, color, isActive }: {
  href: string; label: string; icon: any; color: string; isActive: boolean
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-normal transition-all duration-200 relative overflow-hidden ${
        isActive
          ? 'bg-[rgba(220,39,67,0.15)] border border-[rgba(220,39,67,0.25)] text-red-400 shadow-[inset_3px_0_0_#dc2743]'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {/* Left accent bar for active */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-red-400" />
      )}
      <span
        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 flex-shrink-0 ${
          isActive
            ? 'bg-white/10'
            : 'bg-white/5 group-hover:bg-white/10'
        }`}
        style={isActive ? { boxShadow: `0 0 12px ${color}40` } : {}}
      >
        <Icon
          size={16}
          style={{ color: isActive ? color : undefined }}
          className={isActive ? '' : 'text-gray-500 group-hover:text-gray-300 transition-colors'}
        />
      </span>
      <span className={isActive ? 'text-white' : ''}>{label}</span>
    </Link>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-40 bg-gradient-to-b from-[#0d0d1a] to-[#12060e] border-r border-white/[0.07] shadow-[4px_0_24px_rgba(0,0,0,0.3)]">
      {/* Logo */}
      <div className="p-5 pb-4 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-xl overflow-hidden ring-1 ring-white/10 shadow-lg">
            <Image src="/nextbrand.png" alt="NextBrand Logo" fill className="object-cover" />
          </div>
          <span className="text-white font-normal text-xl tracking-tight">NextBrand</span>
        </Link>
      </div>

      {/* User card at top */}
      {user && (
        <div className="px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/8">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name || 'User'}
                width={34}
                height={34}
                className="rounded-full ring-1 ring-white/20 object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white text-sm font-normal flex-shrink-0 ring-1 ring-white/10">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-normal truncate leading-tight">{user.name}</p>
              <span className={`text-[10px] font-normal uppercase tracking-widest px-1.5 py-0.5 rounded-md ${
                user.plan === 'pro' || user.plan === 'business' || user.plan === 'enterprise'
                  ? 'bg-gradient-to-r from-[#f09433] to-[#dc2743] text-white'
                  : 'bg-white/10 text-gray-400'
              }`}>
                {user.plan || 'Free'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {mainNav.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            color={item.color}
            isActive={pathname === item.href}
          />
        ))}

        {/* AI Tools separator */}
        <div className="pt-4 pb-2 px-3">
          <div className="flex items-center gap-2">
            <Cpu size={11} className="text-red-400/70" />
            <span className="text-[10px] font-normal uppercase tracking-[0.15em] text-gray-600">
              Strumenti AI
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>
        </div>

        {aiNav.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            color={item.color}
            isActive={pathname === item.href}
          />
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 pb-3 space-y-1 border-t border-white/5 pt-3">
        {bottomNav.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            color={item.color}
            isActive={pathname === item.href}
          />
        ))}

        <button
          onClick={logout}
          className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-normal text-gray-500 hover:text-red-400 hover:bg-red-500/8 transition-all duration-200"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 group-hover:bg-red-500/10 transition-all flex-shrink-0">
            <LogOut size={16} className="transition-colors" />
          </span>
          Logout
        </button>
      </div>
    </aside>
  )
}
