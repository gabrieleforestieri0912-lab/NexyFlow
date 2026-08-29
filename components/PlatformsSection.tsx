'use client'

import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { InstagramIcon, TiktokIcon, YoutubeIcon } from '@/lib/icons'

const platforms = [
  {
    name: 'Instagram',
    tagline: 'Crescita organica e Reels',
    href: '/dashboard/connect',
    gradient: 'from-purple-600 via-pink-500 to-orange-400',
    borderGradient: 'group-hover:from-purple-200 group-hover:via-pink-200 group-hover:to-orange-200',
    icon: InstagramIcon,
    features: ['Analisi follower e engagement', 'Ottimizzazione Reels', 'Migliori orari di pubblicazione', 'Analisi competitor'],
  },
  {
    name: 'TikTok',
    tagline: 'Trend virali e crescita rapida',
    href: '/dashboard/connect',
    gradient: 'from-gray-900 to-black',
    borderGradient: 'group-hover:from-gray-300 group-hover:to-gray-400',
    icon: TiktokIcon,
    features: ['Analisi trend virali', 'Strategie di crescita', 'Ottimizzazione hashtag', 'Analisi performance video'],
  },
  {
    name: 'YouTube',
    tagline: 'SEO e monetizzazione',
    href: '/dashboard/connect',
    gradient: 'from-red-600 to-red-700',
    borderGradient: 'group-hover:from-red-200 group-hover:to-red-300',
    icon: YoutubeIcon,
    features: ['Analisi canale e video', 'SEO per titoli e descrizioni', 'Analisi retention pubblico', 'Strategie di monetizzazione'],
  },
]

const viewportOptions = { once: true, margin: '-80px' } as const

export default function PlatformsSection() {
  return (
    <section className="glass-section relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8" id="platforms">
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
          <span className="mb-3 inline-block rounded-full glass-chip px-4 py-1.5 text-sm font-semibold tracking-wide text-pink-600">
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
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl glass-panel transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                {/* Hover border glow */}
                <span className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${platform.borderGradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                <div className="relative p-6 sm:p-8">
                  {/* Icon with brand gradient */}
                  <div
                    className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${platform.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    <platform.icon className="w-9 h-9 text-white" />
                  </div>

                  <h3 className="text-2xl font-semibold text-gray-900">{platform.name}</h3>
                  <p className="mt-1 text-sm font-medium text-gray-500">{platform.tagline}</p>

                  <ul className="mt-6 space-y-3">
                    {platform.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3 text-gray-600">
                        <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/60 text-pink-500">
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
