'use client'

import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const platforms = [
  {
    name: 'Instagram',
    tagline: 'Crescita organica e Reels',
    href: '/dashboard/connect',
    gradient: 'from-purple-600 via-pink-500 to-orange-400',
    borderGradient: 'group-hover:from-purple-200 group-hover:via-pink-200 group-hover:to-orange-200',
    icon: () => (
      <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
      </svg>
    ),
    features: ['Analisi follower e engagement', 'Ottimizzazione Reels', 'Migliori orari di pubblicazione', 'Analisi competitor'],
  },
  {
    name: 'TikTok',
    tagline: 'Trend virali e crescita rapida',
    href: '/dashboard/connect',
    gradient: 'from-gray-900 to-black',
    borderGradient: 'group-hover:from-gray-300 group-hover:to-gray-400',
    icon: () => (
      <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
    features: ['Analisi trend virali', 'Strategie di crescita', 'Ottimizzazione hashtag', 'Analisi performance video'],
  },
  {
    name: 'YouTube',
    tagline: 'SEO e monetizzazione',
    href: '/dashboard/connect',
    gradient: 'from-red-600 to-red-700',
    borderGradient: 'group-hover:from-red-200 group-hover:to-red-300',
    icon: () => (
      <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    features: ['Analisi canale e video', 'SEO per titoli e descrizioni', 'Analisi retention pubblico', 'Strategie di monetizzazione'],
  },
]

const viewportOptions = { once: true, margin: '-80px' } as const

export default function PlatformsSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24 px-4 sm:px-6 lg:px-8" id="platforms">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-pink-100/50 to-purple-100/50 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 translate-x-1/3 translate-y-1/3 rounded-full bg-gradient-to-br from-orange-100/40 to-pink-100/40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOptions}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-gradient-to-r from-pink-50 to-purple-50 px-4 py-1.5 text-sm font-semibold tracking-wide text-pink-600 ring-1 ring-inset ring-pink-200/50">
            Piattaforme supportate
          </span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Tutto in un unico posto per
            <span className="block bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] bg-clip-text text-transparent">
              Instagram, TikTok e YouTube
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Analisi approfondite, strategie personalizzate e strumenti AI per far crescere la tua presenza sui social.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOptions}
              transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
            >
              <Link
                href={platform.href}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                {/* Hover border glow */}
                <span className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${platform.borderGradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                <div className="relative p-6 sm:p-8">
                  {/* Icon with brand gradient */}
                  <div
                    className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${platform.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    <platform.icon />
                  </div>

                  <h3 className="text-2xl font-semibold text-gray-900">{platform.name}</h3>
                  <p className="mt-1 text-sm font-medium text-gray-500">{platform.tagline}</p>

                  <ul className="mt-6 space-y-3">
                    {platform.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3 text-gray-600">
                        <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-pink-50 text-pink-500">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-pink-600 transition-colors group-hover:text-pink-700">
                    Inizia con {platform.name}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
