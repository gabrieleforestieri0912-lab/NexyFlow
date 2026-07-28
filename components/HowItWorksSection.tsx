'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link2, Brain, Rocket } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

const ICONS = [Link2, Brain, Rocket]

export default function HowItWorksSection() {
  const { t } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.15'],
  })

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const steps = [
    {
      icon: ICONS[0],
      title: t('landing.step1Title'),
      description: t('landing.step1Desc'),
    },
    {
      icon: ICONS[1],
      title: t('landing.step2Title'),
      description: t('landing.step2Desc'),
    },
    {
      icon: ICONS[2],
      title: t('landing.step3Title'),
      description: t('landing.step3Desc'),
    },
  ]

  return (
    <section className="relative py-24 md:py-32 px-4 overflow-hidden" id="how-it-works">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-[5%] w-72 h-72 bg-red-500/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-[5%] w-80 h-80 bg-orange-500/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-5">
            <span className="text-sm font-normal text-red-400">{t('landing.howItWorksTitle')}</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-gray-900 mb-5 tracking-tight leading-tight">
            Tre passaggi per{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]">
              decollare
            </span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {t('landing.howItWorksDesc')}
          </p>
        </motion.div>

        {/* Timeline */}
        <div ref={containerRef} className="relative">
          {/* Vertical track */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gray-200 rounded-full -translate-x-1/2" />
          {/* Animated progress line */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-8 md:left-1/2 top-0 w-1 bg-gradient-to-b from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-full -translate-x-1/2 origin-top"
          />

          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => {
              const isLeft = index % 2 === 0
              const Icon = step.icon

              return (
                <div
                  key={index}
                  className="relative flex md:justify-center items-start"
                >
                  {/* Timeline node */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                      delay: 0.1,
                    }}
                    className="absolute left-8 md:left-1/2 top-2 -translate-x-1/2 z-10"
                  >
                    <div className="w-6 h-6 rounded-full bg-white border-[4px] border-gray-200 shadow-md flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ delay: 0.3 }}
                        className="w-2 h-2 rounded-full bg-gradient-to-br from-[#f09433] to-[#bc1888]"
                      />
                    </div>
                  </motion.div>

                  {/* Card */}
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? -60 : 60, y: 40 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{
                      duration: 0.7,
                      ease: [0.16, 1, 0.3, 1],
                      delay: index * 0.1,
                    }}
                    className={`w-full md:w-1/2 pl-16 md:pl-0 ${
                      isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'
                    }`}
                  >
                    <div
                      className={`group relative bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-red-200 ${
                        isLeft ? 'md:mr-auto' : 'md:ml-auto'
                      }`}
                    >
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-500/5 via-orange-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      <div className={`relative flex items-start gap-5 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f09433]/15 via-[#dc2743]/15 to-[#bc1888]/15 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                          <Icon
                            size={28}
                            className="text-red-500"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] opacity-80 leading-none">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <h3 className="text-xl md:text-2xl font-normal text-gray-900 leading-tight">
                              {step.title}
                            </h3>
                          </div>
                          <p className="text-gray-600 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
