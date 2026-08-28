'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MessageSquare, Trash2, Home, PanelLeftClose, ChevronDown, Settings } from 'lucide-react'

interface ChatMessage { role: 'user' | 'assistant'; content: string; isNew?: boolean; isError?: boolean; isDeleted?: boolean; liked?: boolean; disliked?: boolean }
interface Chat { id: number; title: string; messages: ChatMessage[] }

interface Props {
  chats: Chat[]
  currentChatId: number | null
  isSidebarOpen: boolean
  isDesktopSidebarOpen: boolean
  sidebarAccountOpen: boolean
  userName?: string
  userPlan?: string
  userAvatar?: string
  onSelectChat: (id: number) => void
  onNewChat: () => void
  onDeleteClick: (id: number) => void
  onToggleSidebar: () => void
  onToggleDesktopSidebar: () => void
  onToggleAccount: () => void
  t: (key: string) => string
}

export default function ChatSidebar({
  chats, currentChatId, isSidebarOpen, isDesktopSidebarOpen, sidebarAccountOpen,
  userName, userPlan, userAvatar, onSelectChat, onNewChat, onDeleteClick, onToggleSidebar,
  onToggleDesktopSidebar, onToggleAccount, t,
}: Props) {
  return (
    <>
      <aside className={`${isDesktopSidebarOpen ? 'w-80' : 'w-0 overflow-hidden'} bg-white border-r border-gray-200 flex-col hidden lg:flex flex-shrink-0 transition-all duration-300`}>
        <div className="p-4 min-w-80">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#E4405F] transition-colors">
              <Home className="w-4 h-4" />
              Torna alla home
            </Link>
            <button onClick={onToggleDesktopSidebar} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500">
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>
          <button onClick={onNewChat} data-tour-target="new-chat" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all">
            <Plus className="w-5 h-5" />
            <span>{t('chat.newChat')}</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 space-y-1 min-w-80" data-tour-target="chat-history">
          <div className="px-2 py-2 text-xs text-gray-500 font-medium uppercase">{t('chat.recent')}</div>
          {chats.map((chat) => (
            <div key={chat.id} onClick={() => onSelectChat(chat.id)}
              className={`group flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-colors ${currentChatId === chat.id ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
              <div className="flex items-center gap-3 min-w-0">
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{chat.title}</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onDeleteClick(chat.id) }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200" data-tour-target="account">
          <button onClick={onToggleAccount} className="flex items-center gap-3 px-4 py-3 w-full hover:bg-gray-50 rounded-xl transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#f09433] to-[#dc2743] flex items-center justify-center text-white text-sm font-medium overflow-hidden flex-shrink-0">
              {userAvatar ? <img src={userAvatar} alt={userName || ''} className="w-full h-full object-cover" /> : <span>{userName?.charAt(0).toUpperCase()}</span>}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium truncate text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{userPlan || t('chat.freePlan')}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${sidebarAccountOpen ? 'rotate-180' : ''}`} />
          </button>
          {sidebarAccountOpen && (
            <div className="mt-2 space-y-1">
              <Link href="/settings" className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4" />{t('chat.settings')}
              </Link>
            </div>
          )}
        </div>
      </aside>

      <AnimatePresence>
        {isSidebarOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={onToggleSidebar} />}
      </AnimatePresence>

      <motion.aside initial={{ x: -300 }} animate={{ x: isSidebarOpen ? 0 : -300 }} transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 flex flex-col shadow-xl">
        <div className="p-4 flex items-center justify-between mb-2">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#E4405F] transition-colors">
            <Home className="w-4 h-4" />Torna alla home
          </Link>
          <button onClick={onToggleSidebar} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><PanelLeftClose className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="px-4 pb-4">
          <button onClick={onNewChat} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all">
            <Plus className="w-5 h-5" /><span>{t('chat.newChat')}</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          <div className="px-2 py-2 text-xs text-gray-500 font-medium uppercase">{t('chat.recent')}</div>
          {chats.map((chat) => (
            <div key={chat.id} onClick={() => onSelectChat(chat.id)}
              className={`group flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-colors ${currentChatId === chat.id ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
              <div className="flex items-center gap-3 min-w-0">
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{chat.title}</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onDeleteClick(chat.id) }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200" data-tour-target="account">
          <button onClick={onToggleAccount} className="flex items-center gap-3 px-4 py-3 w-full hover:bg-gray-50 rounded-xl transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#f09433] to-[#dc2743] flex items-center justify-center text-white text-sm font-medium overflow-hidden flex-shrink-0">
              {userAvatar ? <img src={userAvatar} alt={userName || ''} className="w-full h-full object-cover" /> : <span>{userName?.charAt(0).toUpperCase()}</span>}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium truncate text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{userPlan || t('chat.freePlan')}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${sidebarAccountOpen ? 'rotate-180' : ''}`} />
          </button>
          {sidebarAccountOpen && (
            <div className="mt-2 space-y-1">
              <Link href="/settings" className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4" />{t('chat.settings')}
              </Link>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  )
}
