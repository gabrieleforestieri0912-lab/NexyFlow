'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, MessageCircle, HelpCircle, CreditCard, User, Shield, BarChart3, Link2 } from 'lucide-react'
import Link from 'next/link'

const faqs = [
  {
    category: 'Getting Started',
    icon: Rocket,
    questions: [
      { q: 'Come creare un account?', a: 'Clicca su "Inizia Gratis", inserisci nome, email e password. Puoi anche registrarti con Google in un click.' },
      { q: 'Come funziona Nexyflow?', a: 'Connetti i tuoi profili social e la nostra AI analizzerà le metriche per fornirti insights e strategie personalizzate.' },
    ],
  },
  {
    category: 'Account',
    icon: User,
    questions: [
      { q: 'Come cambiano la password?', a: 'Vai su Impostazioni > Sicurezza, inserisci la password attuale e la nuova password.' },
      { q: 'Posso cancellare il mio account?', a: 'Sì, contattaci e provvederemo alla cancellazione. Tutti i tuoi dati verranno eliminati definitivamente.' },
    ],
  },
  {
    category: 'Piani e Fatturazione',
    icon: CreditCard,
    questions: [
      { q: 'Quali piani offrite?', a: 'Free (3 query/giorno), Pro (€9.99/mese, query illimitate), Enterprise (€29.99/mese, tutto incluso).' },
      { q: 'Posso cambiare piano?', a: 'Sì, puoi fare upgrade o downgrade in qualsiasi momento dalle impostazioni.' },
    ],
  },
  {
    category: 'Piattaforme',
    icon: Link2,
    questions: [
      { q: 'Quali piattaforme supportate?', a: 'Supportiamo Instagram, TikTok e YouTube con analisi complete e strategie personalizzate.' },
      { q: 'Come connetto i miei profili?', a: 'Vai su Dashboard > Connetti, scegli la piattaforma e segui le istruzioni per collegare il tuo account.' },
    ],
  },
  {
    category: 'Analisi e Dati',
    icon: BarChart3,
    questions: [
      { q: 'Con quale frequenza vengono aggiornati i dati?', a: 'I dati vengono aggiornati in tempo reale ogni volta che effettui un\'analisi.' },
      { q: 'I miei dati sono al sicuro?', a: 'Assolutamente sì. Utilizziamo crittografia end-to-end e non condividiamo mai i tuoi dati con terze parti.' },
    ],
  },
  {
    category: 'Privacy e Sicurezza',
    icon: Shield,
    questions: [
      { q: 'Come vengono utilizzati i miei dati?', a: 'I tuoi dati vengono utilizzati esclusivamente per generare analisi e strategie. Puoi leggere la nostra Privacy Policy per maggiori dettagli.' },
      { q: 'Potete eliminare i miei dati?', a: 'Sì, su richiesta eliminiamo tutti i tuoi dati entro 30 giorni.' },
    ],
  },
]

function Rocket(props: any) { return <HelpCircle {...props} /> }

export default function HelpPage() {
  const [search, setSearch] = useState('')
  const [openFaq, setOpenFaq] = useState<string | null>(null)

  const filtered = search
    ? faqs.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q =>
          q.q.toLowerCase().includes(search.toLowerCase()) ||
          q.a.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter(cat => cat.questions.length > 0)
    : faqs

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-normal text-gray-900 mb-4">Centro Assistenza</h1>
          <p className="text-gray-600 mb-8">Come possiamo aiutarti?</p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca nella guida..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#dc2743] focus:ring-2 focus:ring-[#dc2743]/20 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-8">
          {filtered.map((category) => (
            <div key={category.category}>
              <div className="flex items-center gap-2 mb-4">
                <category.icon className="w-5 h-5 text-[#dc2743]" />
                <h2 className="text-lg font-normal text-gray-900">{category.category}</h2>
              </div>
              <div className="space-y-2">
                {category.questions.map((faq) => (
                  <div
                    key={faq.q}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === faq.q ? null : faq.q)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === faq.q ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {openFaq === faq.q && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 p-8 bg-gray-50 rounded-2xl">
          <MessageCircle className="w-8 h-8 text-[#dc2743] mx-auto mb-3" />
          <h3 className="text-lg font-normal text-gray-900 mb-2">Non hai trovato risposta?</h3>
          <p className="text-gray-600 mb-4">Il nostro team è pronto ad aiutarti.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-medium hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="w-4 h-4" />
            Contattaci
          </Link>
        </div>
      </div>
    </div>
  )
}
