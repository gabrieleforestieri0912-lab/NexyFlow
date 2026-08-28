'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, BarChart3, Link2, Zap, Bot } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { trackGAEvent } from '@/components/GAProvider'

const steps = [
  {
    icon: Bot,
    title: 'Benvenuto su Nexyflow!',
    description: 'La piattaforma AI che analizza i tuoi social media e ti aiuta a crescere più velocemente.',
  },
  {
    icon: Link2,
    title: 'Connetti i tuoi Profili',
    description: 'Collega Instagram, TikTok e YouTube per iniziare a monitorare le tue performance in tempo reale.',
    action: 'Vai a Connetti',
    href: '/dashboard/connect',
  },
  {
    icon: BarChart3,
    title: 'Analizza i tuoi Dati',
    description: 'Scopri metriche dettagliate, engagement e trend di crescita con grafici interattivi.',
    action: 'Vai alla Dashboard',
    href: '/dashboard',
  },
  {
    icon: Zap,
    title: 'Pronto per Crescere!',
    description: 'Usa la chat AI per strategie personalizzate e il content generator per creare post virali.',
    action: 'Inizia!',
    href: '/dashboard',
  },
]

export default function OnboardingWizard() {
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [completed, setCompleted] = useState(false)

  if (!user || user.onboarding_completed || completed) return null

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      complete()
    }
  }

  const complete = async () => {
    trackGAEvent('onboarding_completed')
    try {
      await fetch('/api/auth/onboarding', { method: 'POST' })
    } catch {}
    setCompleted(true)
  }

  const current = steps[step]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#f09433]/20 via-[#dc2743]/20 to-[#bc1888]/20 flex items-center justify-center mx-auto mb-6">
            <current.icon size={36} className="text-red-500" />
          </div>

          <h2 className="text-2xl font-normal text-gray-900 mb-3">{current.title}</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">{current.description}</p>

          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? 'w-8 bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]' : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={complete}
              className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-600 font-normal text-sm hover:bg-gray-200 transition-colors"
            >
              Salta
            </button>
            <button
              onClick={handleNext}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-medium text-sm hover:shadow-lg hover:shadow-red-500/25 transition-all"
            >
              {step < steps.length - 1 ? (
                <>Avanti <ArrowRight size={16} /></>
              ) : (
                <>Completa <Check size={16} /></>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
