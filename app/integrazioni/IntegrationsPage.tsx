'use client'

import { motion } from 'framer-motion'
import { InstagramIcon, TiktokIcon, YoutubeIcon } from '@/lib/icons'
import { ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const platforms = [
  {
    name: 'Instagram',
    icon: InstagramIcon,
    color: 'from-[#f09433] to-[#dc2743]',
    bgColor: 'from-[#f09433]/10 to-[#dc2743]/10',
    borderColor: 'border-[#dc2743]/20',
    textColor: 'text-[#dc2743]',
    steps: [
      'Accedi al tuo account Instagram Business o Creator',
      'Vai su Impostazioni → API → Autorizzazioni',
      'Connetti il tuo account a Nexyflow',
      'Inizia a ricevere analisi dettagliate in tempo reale',
    ],
    benefits: ['Metriche di engagement', 'Analisi follower', 'Migliori orari di pubblicazione', 'Confronto competitor'],
  },
  {
    name: 'TikTok',
    icon: TiktokIcon,
    color: 'from-[#69C9D0] to-[#EE1D52]',
    bgColor: 'from-[#69C9D0]/10 to-[#EE1D52]/10',
    borderColor: 'border-[#EE1D52]/20',
    textColor: 'text-[#EE1D52]',
    steps: [
      'Accedi al tuo account TikTok',
      'Vai su Impostazioni → Privacy e sicurezza',
      'Autorizza Nexyflow alle API di analisi',
      'Analizza performance dei tuoi video',
    ],
    benefits: ['Analisi video virali', 'Tendenze hashtag', 'Crescita follower', 'Benchmark di settore'],
  },
  {
    name: 'YouTube',
    icon: YoutubeIcon,
    color: 'from-[#FF0000] to-[#FF0000]',
    bgColor: 'from-[#FF0000]/10 to-[#FF0000]/10',
    borderColor: 'border-[#FF0000]/20',
    textColor: 'text-[#FF0000]',
    steps: [
      'Accedi al tuo canale YouTube',
      'Vai su Impostazioni → Canale → API',
      'Collega il tuo canale con Nexyflow',
      'Ottieni insight su visualizzazioni e pubblico',
    ],
    benefits: ['Analisi visualizzazioni', 'Dati demografici', 'Performance video', 'Crescita iscritti'],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-normal text-gray-900 mb-4">
            Connetti i tuoi{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]">
              Social Media
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Integra Instagram, TikTok e YouTube con un click. Nexyflow analizza le tue performance
            e ti fornisce strategie AI personalizzate per ogni piattaforma.
          </p>
        </motion.div>

        {/* Platform Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {platforms.map((platform) => {
            const Icon = platform.icon
            return (
              <motion.div
                key={platform.name}
                variants={itemVariants}
                className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm"
              >
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  {/* Left: Info */}
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${platform.bgColor} flex items-center justify-center`}>
                        <Icon size={28} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-normal text-gray-900">{platform.name}</h2>
                        <p className="text-gray-500 text-sm">Integrazione nativa</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      {platform.steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <span className="text-white text-xs font-normal">{i + 1}</span>
                          </div>
                          <span className="text-gray-700">{step}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 rounded-xl text-white font-normal hover:bg-gray-800 transition-colors"
                    >
                      Connetti {platform.name}
                      <ExternalLink size={16} />
                    </Link>
                  </div>

                  {/* Right: Benefits */}
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h3 className="font-normal text-gray-900 mb-4">Cosa ottieni</h3>
                    <div className="space-y-3">
                      {platform.benefits.map((benefit) => (
                        <div key={benefit} className="flex items-center gap-3">
                          <CheckCircle2 size={18} className={platform.textColor} />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <Link
                        href="/dashboard/connect"
                        className="inline-flex items-center gap-2 text-sm font-normal text-gray-900 hover:text-[#dc2743] transition-colors"
                      >
                        Vai alla dashboard
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
