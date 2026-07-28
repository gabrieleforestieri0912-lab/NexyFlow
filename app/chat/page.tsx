'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowDown, TrendingUp, Clock, Lightbulb, PanelLeftOpen
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import ChatSidebar from '@/components/chat/ChatSidebar'
import ChatMessage from '@/components/chat/ChatMessage'
import ChatInput from '@/components/chat/ChatInput'
import DeleteConfirmModal from '@/components/chat/DeleteConfirmModal'

const STORAGE_KEY = 'nextbrand_chats'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  isNew?: boolean
  isError?: boolean
  isDeleted?: boolean
  liked?: boolean
  disliked?: boolean
}

interface Chat {
  id: number
  title: string
  messages: ChatMessage[]
}

function loadChats(): Chat[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}

function saveChats(chats: Chat[]) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(chats)) } catch {}
}

export default function ChatPage() {
  const { user, loading: authLoading, logout } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<number | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true)
  const [messageQueue, setMessageQueue] = useState<string[]>([])
  const [stopTypewriter, setStopTypewriter] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [sidebarAccountOpen, setSidebarAccountOpen] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const isLoadingRef = useRef(false)
  const queueRef = useRef<string[]>([])

  const createNewChat = useCallback(() => {
    const newChat: Chat = { id: Date.now(), title: t('chat.newChat'), messages: [] }
    setChats(prev => [newChat, ...prev])
    setCurrentChatId(newChat.id)
    setMessages([])
    setIsSidebarOpen(false)
  }, [t])

  useEffect(() => {
    if (authLoading) return
    if (!user) { router.push('/login'); return }
    const savedChats = loadChats().filter(c => c.messages?.length > 0)
    if (savedChats.length > 0) {
      setChats(savedChats)
      setCurrentChatId(savedChats[0].id)
      setMessages(savedChats[0].messages || [])
    }
  }, [user, authLoading, router, createNewChat])

  useEffect(() => { if (chats.length > 0) saveChats(chats) }, [chats])
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => { inputRef.current?.focus() }, [messages])

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100)
    }
  }

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })

  const setIsLoadingSync = (val: boolean) => { isLoadingRef.current = val; setIsLoading(val) }

  const updateCurrentChatMessages = (newMessages: ChatMessage[], chatId?: number) => {
    const id = chatId ?? currentChatId
    setChats(prev => prev.map(chat => chat.id === id ? { ...chat, messages: newMessages } : chat))
  }

  const updateCurrentChatTitle = (firstMessage: string, allMessages: ChatMessage[], chatId?: number) => {
    const id = chatId ?? currentChatId
    const title = firstMessage.length > 30 ? firstMessage.substring(0, 30) + '...' : firstMessage
    setChats(prev => prev.map(chat => chat.id === id ? { ...chat, title, messages: allMessages } : chat))
  }

  const sendMessage = async (messageText: string = input) => {
    if (!messageText.trim()) return
    if (isLoadingRef.current) { queueRef.current = [...queueRef.current, messageText.trim()]; setMessageQueue([...queueRef.current]); setInput(''); return }

    let chatId = currentChatId
    if (!chatId) {
      const newChat: Chat = { id: Date.now(), title: t('chat.newChat'), messages: [] }
      chatId = newChat.id
      setChats(prev => [newChat, ...prev])
      setCurrentChatId(chatId)
      setMessages([])
      setIsSidebarOpen(false)
    }

    const userMessage: ChatMessage = { role: 'user', content: messageText.trim() }
    const newMessages = [...(chatId !== currentChatId ? [] : messages), userMessage]
    setMessages(newMessages)
    setInput('')
    setAttachedFile(null)
    if (inputRef.current) inputRef.current.style.height = 'auto'
    setIsLoadingSync(true)
    setStopTypewriter(false)
    abortRef.current = new AbortController()
    updateCurrentChatMessages(newMessages, chatId)

    try {
      const response = await fetch('/api/chat', {
        signal: abortRef.current.signal,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText.trim(), history: messages }),
      })
      if (!response.ok && response.status !== 429) throw new Error('API error')
      const data = await response.json()
      if (data.error) {
        const errMsg: ChatMessage = { role: 'assistant', content: data.error, isError: true }
        setMessages(prev => [...prev, errMsg])
        updateCurrentChatMessages([...newMessages, errMsg], chatId)
      } else {
        const assistantMsg: ChatMessage = { role: 'assistant', content: data.response, isNew: true }
        setMessages(prev => [...prev, assistantMsg])
        updateCurrentChatTitle(messageText.trim(), [...newMessages, assistantMsg], chatId)
      }
    } catch (error: any) {
      if (error.name === 'AbortError') return
      const errMsg: ChatMessage = { role: 'assistant', content: t('chat.errorConnection'), isError: true }
      setMessages(prev => [...prev, errMsg])
      updateCurrentChatMessages([...newMessages, errMsg], chatId)
    } finally {
      setIsLoadingSync(false)
      if (queueRef.current.length > 0) {
        const nextText = queueRef.current[0]
        queueRef.current = queueRef.current.slice(1)
        setMessageQueue([...queueRef.current])
        sendMessage(nextText)
      }
    }
  }

  const handleStop = () => {
    if (abortRef.current) { abortRef.current.abort(); abortRef.current = null }
    setStopTypewriter(true)
    setMessages(prev => {
      const lastMsg = prev[prev.length - 1]
      if (lastMsg?.role === 'assistant' && lastMsg?.isNew) return [...prev.slice(0, -1), { role: 'assistant', content: t('chat.messageDeleted'), isDeleted: true }]
      return prev
    })
    setIsLoadingSync(false)
  }

  const selectChat = (chatId: number) => {
    const chat = chats.find(c => c.id === chatId)
    if (chat) { setCurrentChatId(chatId); setMessages(chat.messages || []); setIsSidebarOpen(false) }
  }

  const confirmDelete = () => {
    if (!deleteConfirmId) return
    const newChats = chats.filter(c => c.id !== deleteConfirmId)
    setChats(newChats)
    saveChats(newChats)
    if (deleteConfirmId === currentChatId) {
      if (newChats.length > 0) selectChat(newChats[0].id)
      else { setCurrentChatId(null); setMessages([]) }
    }
    setDeleteConfirmId(null)
  }

  const handleLogout = async () => { await logout(); router.push('/login') }

  const copyToClipboard = async (text: string) => { try { await navigator.clipboard.writeText(text) } catch {} }

  const retryMessage = useCallback((content: string) => { setInput(content); inputRef.current?.focus() }, [])

  const handleLike = (index: number) => setMessages(prev => prev.map((msg, i) => i === index ? { ...msg, liked: !msg.liked, disliked: false } : msg))
  const handleDislike = (index: number) => setMessages(prev => prev.map((msg, i) => i === index ? { ...msg, disliked: !msg.disliked, liked: false } : msg))

  if (authLoading) {
    return (
      <div className="h-screen flex bg-gray-50">
        <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col flex-shrink-0">
          <div className="p-4 space-y-4">
            <div className="h-4 bg-gray-100 rounded w-24 animate-pulse" />
            <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
          </div>
          <div className="flex-1 px-3 space-y-2">
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        </aside>
        <div className="flex-1 flex flex-col">
          <div className="h-16 border-b border-gray-200 bg-white flex items-center px-6">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 bg-gray-100 rounded animate-pulse" />
              <div className="h-5 bg-gray-100 rounded w-24 animate-pulse" />
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto animate-pulse" />
              <div className="h-6 bg-gray-100 rounded w-48 mx-auto animate-pulse" />
              <div className="h-4 bg-gray-100 rounded w-64 mx-auto animate-pulse" />
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mt-6">
                {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="h-screen flex bg-gray-50 text-gray-900">
      {!isSidebarOpen && (
        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md">
          <PanelLeftOpen className="w-5 h-5" />
        </button>
      )}

      <ChatSidebar
        chats={chats}
        currentChatId={currentChatId}
        isSidebarOpen={isSidebarOpen}
        isDesktopSidebarOpen={isDesktopSidebarOpen}
        deleteConfirmId={deleteConfirmId}
        sidebarAccountOpen={sidebarAccountOpen}
        userName={user.name}
        userPlan={user.plan}
        userAvatar={user.avatar}
        onSelectChat={selectChat}
        onNewChat={createNewChat}
        onDeleteClick={setDeleteConfirmId}
        onToggleSidebar={() => setIsSidebarOpen(false)}
        onToggleDesktopSidebar={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
        onToggleAccount={() => setSidebarAccountOpen(!sidebarAccountOpen)}
        onLogout={handleLogout}
        t={t}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {!isDesktopSidebarOpen && (
          <button onClick={() => setIsDesktopSidebarOpen(true)}
            className="hidden lg:flex fixed top-4 left-4 z-30 p-2 bg-white rounded-xl shadow-md hover:bg-gray-50 transition-colors text-gray-500"
            title="Apri sidebar">
            <PanelLeftOpen className="w-5 h-5" />
          </button>
        )}

        <div className="flex-1 flex flex-col min-h-0">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-normal bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] bg-clip-text text-transparent">{t('chat.subtitle')}</h2>
              </div>
              <div className="w-full max-w-3xl">
                <ChatInput value={input} isLoading={isLoading} messageQueue={messageQueue} attachedFile={attachedFile}
                  inputRef={inputRef} fileInputRef={fileInputRef}
                  onChange={setInput} onSend={sendMessage} onStop={handleStop}
                  onFileAttach={(e) => { if (e.target.files?.[0]) setAttachedFile(e.target.files[0]) }}
                  onRemoveFile={() => setAttachedFile(null)} placeholder={t('chat.inputPlaceholder')} t={t} />
              </div>
              <div className="flex flex-row flex-wrap justify-start gap-2.5 max-w-xl mt-6">
                {[
                  { icon: TrendingUp, text: t('chat.suggestions.increaseEngagement') },
                  { icon: Clock, text: t('chat.suggestions.bestPostingTimes') },
                  { icon: Lightbulb, text: t('chat.suggestions.contentIdeas') },
                ].map((tip, i) => {
                  const IconComp = tip.icon
                  return (
                    <button key={i} onClick={() => sendMessage(tip.text)}
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:text-[#dc2743] hover:border-[#dc2743] hover:shadow-sm transition-all">
                      <IconComp size={16} /><span className="truncate">{tip.text}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <>
              <div ref={messagesContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto custom-scrollbar relative">
                <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <ChatMessage key={index} message={message} index={index} userAvatar={user.avatar}
                        stopTypewriter={stopTypewriter} onLike={handleLike} onDislike={handleDislike}
                        onCopy={copyToClipboard} onRetry={retryMessage} />
                    ))}
                  </AnimatePresence>
                  {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden p-1">
                        <img src="/nextbrand.png" alt="AI" className="w-full h-full object-contain" />
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl p-4">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} className="h-4" />
                </div>
                {showScrollButton && (
                  <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    onClick={scrollToBottom}
                    className="fixed bottom-28 right-8 lg:right-12 p-3 bg-white border border-gray-200 shadow-lg rounded-full text-gray-500 hover:text-gray-900 transition-colors z-10">
                    <ArrowDown className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
              <ChatInput value={input} isLoading={isLoading} messageQueue={messageQueue} attachedFile={attachedFile}
                inputRef={inputRef} fileInputRef={fileInputRef}
                onChange={setInput} onSend={sendMessage} onStop={handleStop}
                onFileAttach={(e) => { if (e.target.files?.[0]) setAttachedFile(e.target.files[0]) }}
                onRemoveFile={() => setAttachedFile(null)} placeholder={t('chat.inputPlaceholder')} t={t} />
            </>
          )}
        </div>
      </div>

      <DeleteConfirmModal isOpen={deleteConfirmId !== null} onCancel={() => setDeleteConfirmId(null)} onConfirm={confirmDelete} t={t} />
    </div>
  )
}
