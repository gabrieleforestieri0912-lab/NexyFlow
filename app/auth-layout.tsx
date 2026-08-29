'use client'
/* eslint-disable @next/next/no-img-element */

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
            <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-lg">
              <img src="/icons/instagram.svg" alt="Instagram" width={40} height={40} className="w-10 h-10" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-lg">
              <img src="/icons/tiktok.svg" alt="TikTok" width={32} height={32} className="w-8 h-8" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-lg">
              <img src="/icons/youtube.svg" alt="YouTube" width={32} height={32} className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-2xl font-normal text-gray-900 mb-2">Gestisci tutti i tuoi social in un unico posto</h3>
          <p className="text-gray-600">Analisi AI, contenuti ottimizzati e crescita accelerata su Instagram, TikTok e YouTube.</p>
        </motion.div>
      </div>
    </div>
  )
}
