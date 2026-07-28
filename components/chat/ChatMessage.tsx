'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, ThumbsUp, ThumbsDown, Copy, ArrowUp } from 'lucide-react'
import TypewriterText from '@/components/TypewriterText'
import { renderMarkdown } from '@/lib/markdown'

interface ChatMessageData { role: 'user' | 'assistant'; content: string; isNew?: boolean; isError?: boolean; isDeleted?: boolean; liked?: boolean; disliked?: boolean }

interface Props {
  message: ChatMessageData
  index: number
  userAvatar?: string
  stopTypewriter?: boolean
  onLike: (index: number) => void
  onDislike: (index: number) => void
  onCopy: (text: string) => void
  onRetry: (text: string) => void
}

export default function ChatMessage({ message, index, userAvatar, stopTypewriter, onLike, onDislike, onCopy, onRetry }: Props) {
  const [typewriterDone, setTypewriterDone] = useState(!message.isNew)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-7 h-7 flex items-center justify-center flex-shrink-0 ${message.role === 'user' ? 'rounded-full bg-gray-200' : 'rounded-full bg-gray-100 overflow-hidden'}`}>
        {message.role === 'user' ? (
          userAvatar ? <img src={userAvatar} alt="" className="w-full h-full rounded-full object-cover" /> : <User className="w-3.5 h-3.5 text-gray-500" />
        ) : (
          <img src="/nextbrand.png" alt="AI" className="w-full h-full object-contain p-0.5" />
        )}
      </div>
      <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
        <div className={`inline-block max-w-[90%] p-3 rounded-2xl ${message.role === 'user' ? 'bg-gray-100 text-gray-900' : message.isError ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-white border border-gray-200 text-gray-900'}`}>
          <div className="text-sm leading-relaxed msg-content">
            {message.role === 'assistant' && !typewriterDone ? (
              <TypewriterText text={message.content} speed={5} stop={stopTypewriter} onComplete={() => setTypewriterDone(true)} />
            ) : (
              <span dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }} />
            )}
          </div>
        </div>
        {message.role === 'assistant' && !message.isDeleted && !message.isError && (
          <div className="flex justify-end gap-1 mt-2">
            <button onClick={() => onLike(index)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Mi piace">
              <ThumbsUp className={`w-3.5 h-3.5 ${message.liked ? 'text-green-500 fill-green-500' : 'text-gray-400'}`} />
            </button>
            <button onClick={() => onDislike(index)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Non mi piace">
              <ThumbsDown className={`w-3.5 h-3.5 ${message.disliked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
            </button>
            <button onClick={() => onCopy(message.content)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Copia">
              <Copy className="w-3.5 h-3.5 text-gray-400" />
            </button>
            <button onClick={() => onRetry(message.content)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Riprova">
              <ArrowUp className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
