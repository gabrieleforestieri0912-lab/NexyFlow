'use client'

import { useState } from 'react'
import { User, Bell, Globe, Shield, Loader2, Check, X, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function SettingsPage() {
  const { user, changePassword } = useAuth()
  const { language, setLanguage } = useLanguage()
  const [notifications, setNotifications] = useState({ email: true, push: true, marketing: false })
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const languages = [
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ]

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess(false)

    if (passwordForm.newPass !== passwordForm.confirm) {
      setPasswordError('Le password non coincidono')
      return
    }
    if (passwordForm.newPass.length < 6) {
      setPasswordError('La password deve essere di almeno 6 caratteri')
      return
    }

    setPasswordLoading(true)
    try {
      await changePassword(passwordForm.current, passwordForm.newPass)
      setPasswordSuccess(true)
      setTimeout(() => { setShowPasswordModal(false); setPasswordSuccess(false) }, 2000)
    } catch (err: any) {
      setPasswordError(err.message || 'Errore')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090f] px-4 sm:px-6 lg:px-8 py-24 sm:py-28">
        <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-normal text-white tracking-tight">Impostazioni</h1>
          <p className="text-gray-400 mt-1 font-normal font-sans">Gestisci le configurazioni del tuo account, le notifiche e la sicurezza.</p>
        </div>

        {/* Profilo */}
        <div className="bg-white/[0.04] backdrop-blur-[12px] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-[#dc2743]" />
            <h2 className="text-lg font-normal text-white">Profilo</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-normal uppercase tracking-wider text-gray-500 mb-2">Nome</label>
              <input
                type="text"
                value={user?.name || ''}
                readOnly
                className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 text-gray-300 text-sm outline-none cursor-not-allowed select-none"
              />
            </div>
            <div>
              <label className="block text-xs font-normal uppercase tracking-wider text-gray-500 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 text-gray-300 text-sm outline-none cursor-not-allowed select-none"
              />
            </div>
            <div>
              <label className="block text-xs font-normal uppercase tracking-wider text-gray-500 mb-2">Piano Attivo</label>
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white text-xs font-medium uppercase tracking-wider">
                  {user?.plan || 'free'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notifiche */}
        <div className="bg-white/[0.04] backdrop-blur-[12px] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-[#dc2743]" />
            <h2 className="text-lg font-normal text-white">Notifiche</h2>
          </div>
          <div className="space-y-3">
            {[
              { id: 'email', label: 'Notifiche Email', desc: 'Ricevi aggiornamenti e report via email' },
              { id: 'push', label: 'Notifiche Push', desc: 'Notifiche in-app e push nel browser' },
              { id: 'marketing', label: 'Marketing', desc: 'Ricevi sconti, offerte e novità' },
            ].map((n) => (
              <label key={n.id} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors cursor-pointer select-none">
                <div>
                  <p className="font-normal text-white text-sm">{n.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={(notifications as any)[n.id]}
                  onChange={() => setNotifications({ ...notifications, [n.id]: !(notifications as any)[n.id] })}
                  className="w-5 h-5 rounded border-white/15 bg-white/5 text-[#dc2743] focus:ring-[#dc2743] focus:ring-offset-0 transition-all cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Lingua */}
        <div className="bg-white/[0.04] backdrop-blur-[12px] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-[#dc2743]" />
            <h2 className="text-lg font-normal text-white">Lingua</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as any)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                  language === lang.code
                    ? 'border-[#dc2743] bg-[#dc2743]/10 text-white shadow-lg shadow-[#dc2743]/5'
                    : 'border-white/5 text-gray-400 hover:border-white/10 hover:text-white bg-white/[0.01]'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-normal text-sm">{lang.label}</span>
                {language === lang.code && <Check className="w-4 h-4 ml-auto text-[#dc2743]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Sicurezza */}
        <div className="bg-white/[0.04] backdrop-blur-[12px] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-[#dc2743]" />
            <h2 className="text-lg font-normal text-white">Sicurezza</h2>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-red-500/10"
          >
            Cambia Password
          </button>
        </div>

        {/* Password Modal */}
        <AnimatePresence>
          {showPasswordModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
              onClick={() => { if (!passwordLoading) setShowPasswordModal(false) }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#0f0f18] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Decorative ambient glow */}
                <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#dc2743]/10 blur-[45px] rounded-full pointer-events-none" />

                <div className="flex items-center justify-between mb-6 relative z-10">
                  <h3 className="text-lg font-normal text-white">Cambia Password</h3>
                  <button onClick={() => setShowPasswordModal(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {passwordSuccess ? (
                  <div className="text-center py-8 relative z-10 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/25 flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6 text-green-400" />
                    </div>
                    <p className="font-normal text-white">Password aggiornata con successo!</p>
                  </div>
                ) : (
                  <form onSubmit={handleChangePassword} className="space-y-4 relative z-10">
                    <div>
                      <label className="block text-xs font-normal uppercase tracking-wider text-gray-400 mb-1.5">Password Attuale</label>
                      <div className="relative">
                        <input
                          type={showCurrent ? 'text' : 'password'}
                          value={passwordForm.current}
                          onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                          required
                          className="w-full px-4 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-[#dc2743] focus:ring-2 focus:ring-[#dc2743]/20 outline-none text-sm transition-all"
                        />
                        <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                          {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-normal uppercase tracking-wider text-gray-400 mb-1.5">Nuova Password</label>
                      <div className="relative">
                        <input
                          type={showNew ? 'text' : 'password'}
                          value={passwordForm.newPass}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                          required
                          minLength={6}
                          className="w-full px-4 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-[#dc2743] focus:ring-2 focus:ring-[#dc2743]/20 outline-none text-sm transition-all"
                        />
                        <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                          {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-normal uppercase tracking-wider text-gray-400 mb-1.5">Conferma Nuova Password</label>
                      <input
                        type="password"
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                        required
                        minLength={6}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-[#dc2743] focus:ring-2 focus:ring-[#dc2743]/20 outline-none text-sm transition-all"
                      />
                    </div>

                    {passwordError && (
                      <p className="text-red-400 text-xs font-medium bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">{passwordError}</p>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowPasswordModal(false)}
                        className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 font-normal text-sm hover:bg-white/5 transition-colors"
                      >
                        Annulla
                      </button>
                      <button
                        type="submit"
                        disabled={passwordLoading}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {passwordLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {passwordLoading ? 'Aggiornamento...' : 'Aggiorna'}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </ProtectedRoute>
  )
}
