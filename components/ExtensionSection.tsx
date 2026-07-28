'use client'

import { Puzzle, ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ChromeIcon } from '@/lib/icons'

export default function ExtensionSection() {
  const features = [
    'Analisi con un click direttamente dal profilo',
    'Integrazione nativa con Instagram, TikTok e YouTube',
    'Risultati in tempo reale',
    'Nessun login aggiuntivo richiesto'
  ]

  return (
    <section className="py-24 px-4 bg-gray-50 overflow-hidden relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium mb-6">
              <Puzzle size={16} />
              Estensione Ufficiale
            </div>
            
            <h2 className="text-4xl md:text-5xl font-normal text-gray-900 mb-6">
              Analizza qualsiasi profilo in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]">un solo click</span>
            </h2>
            
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Scarica la nostra estensione gratuita e ottieni insight immediati mentre navighi su Instagram, TikTok e YouTube. L&apos;IA lavora per te in background.
            </p>
            
            <ul className="space-y-4 mb-10">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                  <CheckCircle2 className="text-red-500" size={20} />
                  {feature}
                </li>
              ))}
            </ul>
            
            <Link
              href="#"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-2xl text-white font-medium hover:shadow-2xl hover:shadow-red-500/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              <ChromeIcon size={20} className="text-white" />
              Aggiungi Estensione
            </Link>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#f09433]/20 via-[#dc2743]/20 to-[#bc1888]/20 rounded-3xl blur-3xl" />
            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden p-2">
              <div className="bg-gray-100 rounded-xl p-4 flex flex-col items-center justify-center min-h-[300px] border border-gray-200 shadow-inner">
                <Puzzle size={64} className="text-gray-400 mb-4 opacity-50" />
                <p className="text-gray-500 font-medium text-center">Anteprima Estensione<br/><span className="text-sm font-normal">L&apos;estensione appare direttamente sulla pagina del profilo</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
