'use client'

import Image from 'next/image'
import Link from 'next/link'
import { InstagramIcon, TiktokIcon, YoutubeIcon } from '@/lib/icons'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="glass-section relative overflow-hidden glass-panel--dark border-t border-white/10">
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#dc2743]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#69C9D0]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
                <Image 
                  src="/nexyflow.png" 
                  alt="Nexyflow" 
                  width={40} 
                  height={40} 
                  className="relative rounded-xl object-contain" 
                />
              </div>
              <span className="text-xl font-normal text-white">Nexyflow</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              L&apos;AI per i social media creator. Analizza, ottimizza e cresci su Instagram, TikTok e YouTube.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#E4405F] hover:border-[#E4405F]/30 hover:bg-[#E4405F]/10 transition-all"
              >
                <InstagramIcon size={18} />
              </motion.a>
              <motion.a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#EE1D52] hover:border-[#EE1D52]/30 hover:bg-[#EE1D52]/10 transition-all"
              >
                <TiktokIcon size={18} />
              </motion.a>
              <motion.a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#FF0000] hover:border-[#FF0000]/30 hover:bg-[#FF0000]/10 transition-all"
              >
                <YoutubeIcon size={18} />
              </motion.a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-normal mb-4 text-sm uppercase tracking-wider">Prodotto</h4>
            <ul className="space-y-3">
              <li><Link href="/#features" className="group relative inline-block text-sm text-gray-400 hover:text-white transition-colors">Funzionalità<span className="absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] transition-all duration-300 ease-out scale-x-0 group-hover:scale-x-100 origin-left" /></Link></li>
              <li><Link href="/pricing" className="group relative inline-block text-sm text-gray-400 hover:text-white transition-colors">Prezzi<span className="absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] transition-all duration-300 ease-out scale-x-0 group-hover:scale-x-100 origin-left" /></Link></li>
              <li><Link href="/#ai-chat" className="group relative inline-block text-sm text-gray-400 hover:text-white transition-colors">AI Chat<span className="absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] transition-all duration-300 ease-out scale-x-0 group-hover:scale-x-100 origin-left" /></Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-normal mb-4 text-sm uppercase tracking-wider">Risorse</h4>
            <ul className="space-y-3">
              <li><Link href="/help" className="group relative inline-block text-sm text-gray-400 hover:text-white transition-colors">Centro Assistenza<span className="absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] transition-all duration-300 ease-out scale-x-0 group-hover:scale-x-100 origin-left" /></Link></li>
              <li><Link href="/contact" className="group relative inline-block text-sm text-gray-400 hover:text-white transition-colors">Contattaci<span className="absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] transition-all duration-300 ease-out scale-x-0 group-hover:scale-x-100 origin-left" /></Link></li>
              <li><Link href="/blog" className="group relative inline-block text-sm text-gray-400 hover:text-white transition-colors">Blog<span className="absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] transition-all duration-300 ease-out scale-x-0 group-hover:scale-x-100 origin-left" /></Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-normal mb-4 text-sm uppercase tracking-wider">Legale</h4>
            <ul className="space-y-3">
              <li><Link href="/terms" className="group relative inline-block text-sm text-gray-400 hover:text-white transition-colors">Termini di Servizio<span className="absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] transition-all duration-300 ease-out scale-x-0 group-hover:scale-x-100 origin-left" /></Link></li>
              <li><Link href="/privacy" className="group relative inline-block text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy<span className="absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] transition-all duration-300 ease-out scale-x-0 group-hover:scale-x-100 origin-left" /></Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Nexyflow. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  )
}
