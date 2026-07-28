'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef, ReactNode } from 'react'
import Link from 'next/link'

const SLICE_COUNT = 8

const sliceVariants = {
  initial: (i: number) => ({
    x: i % 2 === 0 ? '-100%' : '100%',
    opacity: 0,
  }),
  animate: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      delay: i * 0.05,
    },
  }),
  exit: (i: number) => ({
    x: i % 2 === 0 ? '100%' : '-100%',
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: [0.55, 0.16, 0.25, 0.86] as const,
      delay: (SLICE_COUNT - 1 - i) * 0.04,
    },
  }),
}

const AuthSliceAnimation = ({ isAnimating }: { isAnimating: boolean }) => (
  isAnimating ? (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {[...Array(SLICE_COUNT)].map((_, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={sliceVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute top-0 h-full bg-gradient-to-br from-[#f09433]/20 via-[#dc2743]/10 to-[#bc1888]/20"
          style={{
            left: `${(i * 100) / SLICE_COUNT}%`,
            width: `${100 / SLICE_COUNT}%`,
            zIndex: SLICE_COUNT - i,
          }}
        />
      ))}
    </div>
  ) : null
)

export default function AuthLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isAnimating, setIsAnimating] = useState(false)
  const prevPathname = useRef(pathname)

  useEffect(() => {
    const isAuthPath = pathname === '/login' || pathname === '/register'
    const wasAuthPath = prevPathname.current === '/login' || prevPathname.current === '/register'

    if (isAuthPath && wasAuthPath && pathname !== prevPathname.current) {
      setTimeout(() => setIsAnimating(true), 0)
      const timer = setTimeout(() => setIsAnimating(false), 800)
      return () => clearTimeout(timer)
    }
    prevPathname.current = pathname
  }, [pathname])

  return (
    <div className="h-screen bg-white flex flex-col lg:flex-row overflow-hidden relative">
      <Link href="/" className="absolute top-4 left-4 z-30 text-sm text-gray-500 hover:text-[#dc2743] transition-colors">
        ← Torna alla home
      </Link>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 lg:py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-full max-w-md">
            <AuthSliceAnimation isAnimating={isAnimating} />
            <motion.div
              initial={isAnimating ? { opacity: 0, y: 30 } : undefined}
              animate={isAnimating ? { opacity: 1, y: 0 } : undefined}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative z-10"
            >
              {children}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#f09433]/20 via-[#dc2743]/10 to-[#bc1888]/20 items-center justify-center p-12 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-lg text-center"
        >
          <div className="flex justify-center gap-6 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
              </svg>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-normal text-gray-900 mb-2">Gestisci tutti i tuoi social in un unico posto</h3>
          <p className="text-gray-600">Analisi AI, contenuti ottimizzati e crescita accelerata su Instagram, TikTok e YouTube.</p>
        </motion.div>
      </div>
    </div>
  )
}
