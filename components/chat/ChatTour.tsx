'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Play } from 'lucide-react'

interface TourStep {
  title: string
  body: string
  target: string
}

interface Props {
  t: (key: string) => string
  steps: TourStep[]
  open: boolean
  onClose: () => void
}

const TOUR_STORAGE_KEY = 'nexyflow_chat_tour_completed'

function getTargetRect(selector: string): DOMRect | null {
  const el = document.querySelector<HTMLElement>(selector)
  if (!el) return null
  const rect = el.getBoundingClientRect()
  if (rect.width === 0 && rect.height === 0) return null
  return rect
}

export function hasTourCompleted(): boolean {
  if (typeof window === 'undefined') return true
  try { return localStorage.getItem(TOUR_STORAGE_KEY) === '1' } catch { return true }
}

export function completeTour() {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(TOUR_STORAGE_KEY, '1') } catch {}
}

export default function ChatTour({ t, steps, open, onClose }: Props) {
  const [current, setCurrent] = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const [tooltipPos, setTooltipPos] = useState<'above' | 'below'>(() =>
    typeof window === 'undefined' || window.innerWidth < 640 ? 'below' : 'below'
  )
  const [viewport, setViewport] = useState({ w: 0, h: 0 })

  const step = steps[current]
  const total = steps.length

  const scrollTargetIntoView = useCallback((selector: string) => {
    const el = document.querySelector<HTMLElement>(selector)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    }
  }, [])

  const updateGeometry = useCallback(() => {
    if (!step) return
    const r = getTargetRect(step.target)
    setRect(r)
    setViewport({ w: window.innerWidth, h: window.innerHeight })
    if (r) {
      const spaceAbove = r.top
      const spaceBelow = window.innerHeight - r.bottom
      setTooltipPos(spaceAbove >= 260 || spaceBelow < 260 ? 'above' : 'below')
    }
  }, [step])

  useEffect(() => {
    if (!open || !step) return
    scrollTargetIntoView(step.target)
    const t1 = setTimeout(updateGeometry, 350)
    const t2 = setTimeout(updateGeometry, 700)
    window.addEventListener('resize', updateGeometry)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      window.removeEventListener('resize', updateGeometry)
    }
  }, [open, step, scrollTargetIntoView, updateGeometry])

  const start = useCallback(() => {
    setCurrent(0)
  }, [])

  const next = useCallback(() => {
    if (current < total - 1) setCurrent(c => c + 1)
    else { completeTour(); onClose() }
  }, [current, total, onClose])

  const prev = useCallback(() => {
    if (current > 0) setCurrent(c => c - 1)
  }, [current])

  const skip = useCallback(() => {
    completeTour()
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- riavvia il tour all'apertura
    start()
  }, [open, start])

  if (!open || !step) return null

  const isLast = current === total - 1
  const showTooltipAbove = tooltipPos === 'above'

  const tooltipStyle: React.CSSProperties = rect
    ? {
        left: Math.min(Math.max(rect.left + rect.width / 2 - 180, 16), Math.max(viewport.w - 376, 16)),
        width: 360,
        maxWidth: 'calc(100vw - 32px)',
        ...(showTooltipAbove
          ? { bottom: `calc(100vh - ${rect.top}px + 14px)` }
          : { top: rect.bottom + 14 }),
      }
    : { left: 16, right: 16, top: '50%', transform: 'translateY(-50%)', width: 'auto' }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[80]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ pointerEvents: 'none' }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-slate-900/60" style={{ pointerEvents: 'auto' }} onClick={skip} />

        {/* Spotlight cutout */}
        {rect && (
          <div
            className="absolute rounded-2xl shadow-[0_0_0_9999px_rgba(15,23,42,0.6)]"
            style={{
              left: rect.left - 8,
              top: rect.top - 8,
              width: rect.width + 16,
              height: rect.height + 16,
              transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
              boxShadow: `0 0 0 9999px rgba(15,23,42,0.62), 0 0 0 3px rgba(255,255,255,0.9), 0 24px 60px -12px rgba(0,0,0,0.5)`,
            }}
          />
        )}

        {/* Tooltip card */}
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
          className="absolute z-10 rounded-3xl bg-white shadow-2xl border border-white/40 overflow-hidden"
          style={{ ...tooltipStyle, pointerEvents: 'auto' }}
        >
          {/* Gradient top line */}
          <div className="h-1.5 bg-linear-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]" />
          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#dc2743] mb-1">
                  {t('chat.tour.title')}
                </p>
                <h3 className="text-lg font-semibold text-gray-900 leading-snug">{step.title}</h3>
              </div>
              <button
                onClick={skip}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
                aria-label={t('chat.tour.close')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-5">{step.body}</p>

            {/* Progress dots */}
            <div className="flex items-center gap-1.5 mb-5">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-6 bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]'
                      : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`${t('chat.tour.step').replace('{current}', String(i + 1)).replace('{total}', String(total))}`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={skip}
                className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
              >
                {t('chat.tour.skip')}
              </button>
              <div className="flex items-center gap-2">
                {current > 0 && (
                  <button
                    onClick={prev}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {t('chat.tour.prev')}
                  </button>
                )}
                <button
                  onClick={next}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-lg shadow-red-500/20 hover:shadow-red-500/30 hover:-translate-y-0.5 transition-all"
                >
                  {isLast ? t('chat.tour.done') : t('chat.tour.next')}
                  {!isLast && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export function ReplayTourButton({ t, onClick }: { t: (key: string) => string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-[#dc2743] hover:bg-gray-50 transition-colors"
      title={t('chat.tour.replay')}
    >
      <Play className="w-4 h-4" />
      {t('chat.tour.replay')}
    </button>
  )
}