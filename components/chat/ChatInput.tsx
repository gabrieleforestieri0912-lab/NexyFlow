'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Paperclip, X, Square, Send, Clock } from 'lucide-react'

interface Props {
  value: string
  isLoading: boolean
  messageQueue: string[]
  attachedFile: File | null
  inputRef: React.RefObject<HTMLTextAreaElement | null>
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onChange: (val: string) => void
  onSend: () => void
  onStop: () => void
  onFileAttach: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveFile: () => void
  placeholder: string
  t: (key: string) => string
}

export default function ChatInput({
  value, isLoading, messageQueue, attachedFile,
  inputRef, fileInputRef, onChange, onSend, onStop,
  onFileAttach, onRemoveFile, placeholder, t,
}: Props) {
  const handleInputResize = () => {
    const el = inputRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`
    }
  }

  useEffect(() => {
    handleInputResize()
  }, [value])

  return (
    <div className="p-4">
      <div className="max-w-3xl mx-auto">
      {messageQueue.length > 0 && (
        <div className="space-y-1 mb-2">
          {messageQueue.map((q, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
              <Clock className="w-3 h-3 shrink-0" />
              <span className="truncate">{q}</span>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-1 bg-white rounded-2xl border border-gray-300 shadow-sm transition-all duration-200 relative">
        <AnimatePresence>
          {attachedFile && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              className="absolute -top-12 left-0 bg-white shadow-lg border border-gray-200 rounded-xl px-3.5 py-2 flex items-center gap-2.5 text-sm text-gray-700 z-10">
              <Paperclip className="w-4 h-4 text-gray-400" />
              <span className="truncate max-w-[160px]">{attachedFile.name}</span>
              <button onClick={onRemoveFile} className="p-0.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"><X className="w-3.5 h-3.5" /></button>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => fileInputRef.current?.click()} className="p-3 text-gray-400 hover:text-[#dc2743] transition-colors flex-shrink-0">
          <Paperclip className="w-5 h-5" />
        </button>
        <input type="file" ref={fileInputRef} onChange={onFileAttach} className="hidden" />
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => { onChange(e.target.value); handleInputResize() }}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend() } }}
          placeholder={placeholder}
          rows={1}
          className="flex-1 bg-transparent text-gray-900 py-3.5 px-1 resize-none focus:outline-none focus:ring-0 max-h-[200px] placeholder:text-gray-400 leading-relaxed chat-input"
        />
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => { if (isLoading) onStop(); else onSend() }}
          className={`m-1.5 p-2.5 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 ${isLoading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white hover:shadow-lg hover:shadow-[#dc2743]/20'}`}>
          {isLoading ? <Square className="w-4 h-4 fill-current" /> : <Send className="w-4 h-4" />}
        </motion.button>
      </div>
      </div>
    </div>
  )
}
