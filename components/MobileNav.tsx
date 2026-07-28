'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BarChart3, Lightbulb, Link2, Sparkles, FileText } from 'lucide-react'

const tabs = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard, color: '#dc2743' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3, color: '#8b5cf6' },
  { href: '/dashboard/analyze', label: 'Analizza', icon: Sparkles, color: '#dc2743' },
  { href: '/dashboard/strategy', label: 'Strategia', icon: Lightbulb, color: '#f09433' },
  { href: '/dashboard/tools/content-generator', label: 'Contenuti', icon: FileText, color: '#f09433' },
]

export default function MobileNav() {
  const pathname = usePathname()

  if (!pathname.startsWith('/dashboard')) return null

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#09090f]/95 backdrop-blur-xl border-t border-white/6">
      <div className="flex items-center justify-around py-2 px-2 safe-area-inset-bottom">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[52px] ${
                isActive ? 'text-white' : 'text-gray-600 hover:text-gray-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isActive ? 'scale-110' : ''
                }`}
                style={isActive ? {
                  background: `${tab.color}20`,
                  border: `1px solid ${tab.color}30`,
                } : {}}
              >
                <tab.icon
                  size={18}
                  style={isActive ? { color: tab.color } : {}}
                />
              </div>
              <span className={`text-[10px] font-normal leading-none ${
                isActive ? 'text-white' : 'text-gray-600'
              }`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
