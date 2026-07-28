'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, HelpCircle, ArrowRight, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const faqs = [
  {
    q: 'Come funziona NextBrand?',
    a: 'NextBrand è una piattaforma AI che analizza i tuoi profili social (Instagram, TikTok, YouTube) e ti fornisce insights dettagliati, consigli personalizzati e strategie per far crescere la tua presenza online.',
  },
  {
    q: 'Quali piattaforme sono supportate?',
    a: 'Supportiamo Instagram, TikTok e YouTube. Per ogni piattaforma offriamo analisi dettagliate delle performance, suggerimenti di crescita e strumenti di content generation.',
  },
  {
    q: 'NextBrand è gratuito?',
    a: 'Offriamo un piano gratuito con 3 query AI giornaliere e analisi di base. I piani Pro ed Enterprise sbloccano funzionalità avanzate, query illimitate e analisi più approfondite.',
  },
  {
    q: 'Come vengono utilizzati i miei dati?',
    a: 'I tuoi dati sono al sicuro. Utilizziamo crittografia end-to-end e non condividiamo mai le tue informazioni con terze parti. Puoi eliminare i tuoi dati in qualsiasi momento.',
  },
  {
    q: 'Posso connettere più account della stessa piattaforma?',
    a: 'Attualmente supportiamo un account per piattaforma. Se hai bisogno di gestire più account, contattaci per soluzioni personalizzate.',
  },
  {
    q: 'Come funziona l\'analisi AI?',
    a: 'La nostra AI analizza metriche come follower, engagement, visualizzazioni e frequenza di pubblicazione, offrendo consigli specifici per migliorare le tue performance.',
  },
  {
    q: 'Posso cancellare il mio account?',
    a: 'Sì, puoi cancellare il tuo account in qualsiasi momento dalle impostazioni. Tutti i tuoi dati verranno eliminati permanentemente.',
  },
]

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
}

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeFaq = faqs[activeIndex]

  return (
    <section className="relative py-24 px-4 overflow-hidden bg-linear-to-b from-gray-50/80 via-white to-gray-50/50" id="faq">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-linear-to-br from-red-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-linear-to-br from-pink-500/10 to-transparent rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/5 border border-red-500/10 text-red-500 text-xs font-medium uppercase tracking-wider mb-4">
            <HelpCircle size={14} />
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-normal text-gray-900 mb-4 tracking-tight">
            Domande{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]">
              Frequenti
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Tutto quello che devi sapere su NextBrand
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="grid lg:grid-cols-[1fr_1.2fr] gap-8 items-start"
        >
          {/* Questions column */}
          <div className="space-y-3" role="tablist" aria-label="Domande frequenti">
            {faqs.map((faq, index) => {
              const isActive = activeIndex === index

              return (
                <motion.button
                  key={faq.q}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="faq-answer-panel"
                  id={`faq-tab-${index}`}
                  variants={itemVariants}
                  onClick={() => setActiveIndex(index)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`group w-full text-left rounded-2xl border p-4 transition-all duration-300 relative overflow-hidden focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:outline-none ${
                    isActive
                      ? 'border-red-500/30 bg-white shadow-xl shadow-red-500/5'
                      : 'border-gray-200/80 bg-white/70 hover:border-red-300/50 hover:bg-white hover:shadow-lg hover:shadow-gray-200/40'
                  }`}
                >                    {isActive && (
                    <div className="absolute inset-0 bg-linear-to-r from-red-500/5 via-pink-500/5 to-transparent" />
                  )}

                  <div className="relative flex items-start gap-4">
                    <span
                      className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-300 ${
                        isActive
                          ? 'bg-linear-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-lg shadow-red-500/25'
                          : 'bg-gray-100 text-gray-500 group-hover:bg-red-50 group-hover:text-red-500'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span
                      className={`flex-1 text-sm md:text-base leading-snug pt-0.5 transition-colors duration-200 ${
                        isActive ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                      }`}
                    >
                      {faq.q}
                    </span>

                    <span
                      className={`shrink-0 mt-0.5 transition-all duration-300 ${
                        isActive ? 'text-red-500 rotate-90' : 'text-gray-400 group-hover:text-red-400'
                      }`}
                    >
                      <ChevronRight size={18} />
                    </span>
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Answer panel */}
          <div
            id="faq-answer-panel"
            role="tabpanel"
            aria-labelledby={`faq-tab-${activeIndex}`}
            aria-live="polite"
            className="relative lg:sticky lg:top-24"
          >
            <div className="relative rounded-3xl border border-white/20 bg-white/90 backdrop-blur-xl shadow-2xl shadow-gray-400/10 overflow-hidden min-h-75">
              {/* Top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]" />

              {/* Ambient glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl" />

              <div className="relative p-6 md:p-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/5 border border-red-500/10 text-red-500 text-xs font-medium uppercase tracking-wider mb-6">
                      <MessageCircle size={13} />
                      Risposta
                    </span>

                    <h3 className="text-2xl md:text-3xl font-normal text-gray-900 mb-6 leading-tight">
                      {activeFaq.q}
                    </h3>

                    <p className="text-gray-600 text-lg leading-relaxed">
                      {activeFaq.a}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Decorative quote mark */}
                <div className="absolute top-4 right-6 text-8xl font-serif text-red-500/3 leading-none select-none pointer-events-none">
                  &ldquo;
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <Link
            href="/help"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-linear-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-medium shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <MessageCircle size={18} />
            <span>Non hai trovato risposta?</span>
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
