'use client'

import { useState } from 'react'
import { User, Bell, Globe, Shield, Loader2, Check, X, Eye, EyeOff, LogOut, AlertTriangle, ArrowRight, ChevronLeft } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function SettingsPage() {
  const { user, changePassword, logout } = useAuth()
  const { t, language, setLanguage } = useLanguage()
  const [notifications, setNotifications] = useState({ email: true, push: true, marketing: false })
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [logoutStep, setLogoutStep] = useState(1)
  const [logoutLoading, setLogoutLoading] = useState(false)

  const languages = [
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ]

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess(false)

    if (passwordForm.newPass !== passwordForm.confirm) {
      setPasswordError(t('settings.passwordsDoNotMatch'))
      return
    }
    if (passwordForm.newPass.length < 6) {
      setPasswordError(t('settings.passwordTooShort'))
      return
    }

    setPasswordLoading(true)
    try {
      await changePassword(passwordForm.current, passwordForm.newPass)
      setPasswordSuccess(true)
      setTimeout(() => { setShowPasswordModal(false); setPasswordSuccess(false) }, 2000)
    } catch (err: any) {
      setPasswordError(err.message || t('settings.passwordChangeError'))
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleLogout = async () => {
    setLogoutLoading(true)
    await logout()
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#faf6ff] via-white to-[#fff5f8] px-4 sm:px-6 lg:px-8 py-24 sm:py-28">
        {/* Ambient background orbs */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-[#f09433]/15 to-[#dc2743]/10 blur-[140px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-tr from-[#8b5cf6]/15 to-[#69C9D0]/10 blur-[120px] rounded-full" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#bc1888]/5 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        <div>
          <h1 className="text-3xl font-normal text-gray-900 tracking-tight">{t('settings.title')}</h1>
          <p className="text-gray-500 mt-1 font-normal font-sans">{t('settings.subtitle')}</p>
        </div>

        {/* Profilo */}
        <section className="glass-panel rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-[#dc2743]" />
            <h2 className="text-lg font-normal text-gray-900">{t('settings.profileTitle')}</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-normal uppercase tracking-wider text-gray-500 mb-2">{t('settings.nameLabel')}</label>
              <input
                type="text"
                value={user?.name || ''}
                readOnly
                className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/60 text-gray-700 text-sm outline-none cursor-not-allowed select-none backdrop-blur-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-normal uppercase tracking-wider text-gray-500 mb-2">{t('settings.emailLabel')}</label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/60 text-gray-700 text-sm outline-none cursor-not-allowed select-none backdrop-blur-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-normal uppercase tracking-wider text-gray-500 mb-2">{t('settings.planLabel')}</label>
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white text-xs font-medium uppercase tracking-wider">
                  {user?.plan || 'free'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Notifiche */}
        <section className="glass-panel rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-[#dc2743]" />
            <h2 className="text-lg font-normal text-gray-900">{t('settings.notificationsTitle')}</h2>
          </div>
          <div className="space-y-3">
            {[
              { id: 'email', label: t('settings.weeklyReport'), desc: t('settings.weeklyReportDesc') },
              { id: 'push', label: t('settings.aiAlerts'), desc: t('settings.aiAlertsDesc') },
              { id: 'marketing', label: t('settings.productUpdates'), desc: t('settings.productUpdatesDesc') },
            ].map((n) => (
              <label key={n.id} className="flex items-center justify-between p-3.5 rounded-xl bg-white/40 border border-white/60 hover:border-[#dc2743]/30 transition-colors cursor-pointer select-none">
                <div>
                  <p className="font-normal text-gray-800 text-sm">{n.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={(notifications as any)[n.id]}
                  onChange={() => setNotifications({ ...notifications, [n.id]: !(notifications as any)[n.id] })}
                  className="w-5 h-5 rounded border-gray-300 bg-white text-[#dc2743] focus:ring-[#dc2743] focus:ring-offset-0 transition-all cursor-pointer"
                />
              </label>
            ))}
          </div>
        </section>

        {/* Lingua */}
        <section className="glass-panel rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-[#dc2743]" />
            <h2 className="text-lg font-normal text-gray-900">{t('settings.languageTitle')}</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as any)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                  language === lang.code
                    ? 'border-[#dc2743] bg-white text-gray-900 shadow-lg shadow-[#dc2743]/10'
                    : 'border-white/60 text-gray-500 hover:border-[#dc2743]/30 hover:text-gray-700 bg-white/40'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-normal text-sm">{lang.label}</span>
                {language === lang.code && <Check className="w-4 h-4 ml-auto text-[#dc2743]" />}
              </button>
            ))}
          </div>
        </section>

        {/* Sicurezza */}
        <section className="glass-panel rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-[#dc2743]" />
            <h2 className="text-lg font-normal text-gray-900">{t('settings.securityTitle')}</h2>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-red-500/10"
          >
            {t('settings.changePassword')}
          </button>
        </section>

        {/* Logout */}
        <section className="glass-panel rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <LogOut className="w-5 h-5 text-[#dc2743]" />
            <h2 className="text-lg font-normal text-gray-900">{t('settings.logoutTitle')}</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">{t('settings.logoutDesc')}</p>
          <button
            onClick={() => { setLogoutStep(1); setShowLogoutModal(true) }}
            className="px-6 py-3 rounded-xl border-2 border-[#dc2743]/40 text-[#dc2743] font-medium text-sm hover:bg-[#dc2743]/5 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {t('settings.logoutButton')}
          </button>
        </section>

        {/* Password Modal */}
        <AnimatePresence>
          {showPasswordModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
              onClick={() => { if (!passwordLoading) setShowPasswordModal(false) }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="glass-panel rounded-2xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Decorative ambient glow */}
                <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#dc2743]/10 blur-[45px] rounded-full pointer-events-none" />

                <div className="flex items-center justify-between mb-6 relative z-10">
                  <h3 className="text-lg font-normal text-gray-900">{t('settings.passwordModalTitle')}</h3>
                  <button onClick={() => setShowPasswordModal(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-white/60 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {passwordSuccess ? (
                  <div className="text-center py-8 relative z-10 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/25 flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6 text-green-500" />
                    </div>
                    <p className="font-normal text-gray-900">{t('settings.passwordSuccess')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleChangePassword} className="space-y-4 relative z-10">
                    <div>
                      <label className="block text-xs font-normal uppercase tracking-wider text-gray-500 mb-1.5">{t('settings.currentPassword')}</label>
                      <div className="relative">
                        <input
                          type={showCurrent ? 'text' : 'password'}
                          value={passwordForm.current}
                          onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                          required
                          placeholder={t('settings.currentPasswordPlaceholder')}
                          className="w-full px-4 pr-10 py-3 rounded-xl bg-white/70 border border-white/60 text-gray-800 placeholder-gray-400 focus:border-[#dc2743] focus:ring-2 focus:ring-[#dc2743]/20 outline-none text-sm transition-all"
                        />
                        <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                          {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-normal uppercase tracking-wider text-gray-500 mb-1.5">{t('settings.newPassword')}</label>
                      <div className="relative">
                        <input
                          type={showNew ? 'text' : 'password'}
                          value={passwordForm.newPass}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                          required
                          minLength={6}
                          placeholder={t('settings.newPasswordPlaceholder')}
                          className="w-full px-4 pr-10 py-3 rounded-xl bg-white/70 border border-white/60 text-gray-800 placeholder-gray-400 focus:border-[#dc2743] focus:ring-2 focus:ring-[#dc2743]/20 outline-none text-sm transition-all"
                        />
                        <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                          {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-normal uppercase tracking-wider text-gray-500 mb-1.5">{t('settings.confirmPassword')}</label>
                      <input
                        type="password"
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                        required
                        minLength={6}
                        placeholder={t('settings.confirmPasswordPlaceholder')}
                        className="w-full px-4 py-3 rounded-xl bg-white/70 border border-white/60 text-gray-800 placeholder-gray-400 focus:border-[#dc2743] focus:ring-2 focus:ring-[#dc2743]/20 outline-none text-sm transition-all"
                      />
                    </div>

                    {passwordError && (
                      <p className="text-red-600 text-xs font-medium bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">{passwordError}</p>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowPasswordModal(false)}
                        className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-normal text-sm hover:bg-white/70 transition-colors"
                      >
                        {t('settings.logoutCancel')}
                      </button>
                      <button
                        type="submit"
                        disabled={passwordLoading}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {passwordLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {passwordLoading ? t('settings.updatingPassword') : t('settings.updatePassword')}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout 2-step Modal */}
        <AnimatePresence>
          {showLogoutModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
              onClick={() => { if (!logoutLoading) { setShowLogoutModal(false); setLogoutStep(1) } }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="glass-panel rounded-2xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#dc2743]/10 blur-[45px] rounded-full pointer-events-none" />

                <AnimatePresence mode="wait">
                  {logoutStep === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="relative z-10"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#dc2743]/10 border border-[#dc2743]/20 flex items-center justify-center mb-4">
                        <AlertTriangle className="w-6 h-6 text-[#dc2743]" />
                      </div>
                      <h3 className="text-lg font-normal text-gray-900 mb-1">{t('settings.logoutModalTitle')}</h3>
                      <p className="text-sm text-gray-500 mb-6">{t('settings.logoutModalDesc')}</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => { setShowLogoutModal(false); setLogoutStep(1) }}
                          className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-normal text-sm hover:bg-white/70 transition-colors"
                        >
                          {t('settings.logoutCancel')}
                        </button>
                        <button
                          onClick={() => setLogoutStep(2)}
                          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                          {t('settings.logoutContinue')}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="relative z-10"
                    >
                      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                        <LogOut className="w-6 h-6 text-red-500" />
                      </div>
                      <h3 className="text-lg font-normal text-gray-900 mb-1">{t('settings.logoutStep2Title')}</h3>
                      <p className="text-sm text-gray-500 mb-6">{t('settings.logoutStep2Desc')}</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setLogoutStep(1)}
                          disabled={logoutLoading}
                          className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-normal text-sm hover:bg-white/70 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          {t('settings.logoutBack')}
                        </button>
                        <button
                          onClick={handleLogout}
                          disabled={logoutLoading}
                          className="flex-1 py-3 rounded-xl bg-[#dc2743] text-white font-medium text-sm hover:bg-[#c01f39] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {logoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                          {logoutLoading ? t('settings.logoutButton') + '...' : t('settings.logoutConfirm')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </ProtectedRoute>
  )
}