'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Trash2 } from 'lucide-react'

interface Props {
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
  t: (key: string) => string
}

export default function DeleteConfirmModal({ isOpen, onCancel, onConfirm, t }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-xl font-normal text-gray-900 mb-2">{t('chat.deleteTitle')}</h3>
            <p className="text-gray-500 text-sm mb-6">{t('chat.deleteConfirm')}</p>
            <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-normal hover:bg-gray-200 transition-colors">
                {t('common.cancel')}
              </button>
              <button onClick={onConfirm} className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-normal hover:bg-red-600 transition-colors">
                {t('common.confirm')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
