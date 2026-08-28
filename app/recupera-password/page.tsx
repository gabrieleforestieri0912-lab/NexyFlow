'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Key, ArrowLeft, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

type Step = 'email' | 'code' | 'password' | 'success'

export default function RecuperaPasswordPage() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  const sendCode = async () => {
    if (!email) return
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStep('code')
      startResendTimer()
    } catch (err: any) {
      setError(err.message || 'Errore durante l\'invio del codice')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyCode = async () => {
    if (!code) return
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStep('password')
    } catch (err: any) {
      setError(err.message || 'Codice errato')
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async () => {
    if (!password || password !== confirmPassword) {
      setError('Le password non coincidono')
      return
    }
    if (password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStep('success')
    } catch (err: any) {
      setError(err.message || 'Errore durante il reset')
    } finally {
      setIsLoading(false)
    }
  }

  const startResendTimer = () => {
    setResendTimer(60)
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const resendCode = async () => {
    if (resendTimer > 0) return
    setIsLoading(true)
    try {
      await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      startResendTimer()
    } catch {} finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex justify-center mb-8">
            <img src="/nexyflow.png" alt="Nexyflow" className="w-14 h-14 object-contain" />
          </Link>
          <h1 className="text-3xl font-normal text-gray-900 mb-2">Recupera Accesso</h1>
          <p className="text-gray-500">
            {step === 'email' && 'Inserisci la tua email per ricevere un codice di verifica'}
            {step === 'code' && 'Inserisci il codice ricevuto via email'}
            {step === 'password' && 'Scegli la tua nuova password'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step === 'email' && (
            <motion.div key="email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="relative mb-4">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@esempio.com"
                  onKeyDown={(e) => e.key === 'Enter' && sendCode()}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#dc2743] focus:ring-2 focus:ring-[#dc2743]/20 outline-none transition-all text-sm"
                />
              </div>
              <button
                onClick={sendCode}
                disabled={isLoading || !email}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                {isLoading ? 'Invio...' : 'Invia Codice'}
              </button>
            </motion.div>
          )}

          {step === 'code' && (
            <motion.div key="code" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="relative mb-4">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  onKeyDown={(e) => e.key === 'Enter' && verifyCode()}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#dc2743] focus:ring-2 focus:ring-[#dc2743]/20 outline-none transition-all text-sm text-center text-2xl tracking-[8px] font-mono"
                />
              </div>
              <button
                onClick={verifyCode}
                disabled={isLoading || code.length !== 6}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mb-4"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                {isLoading ? 'Verifica...' : 'Verifica Codice'}
              </button>
              <button
                onClick={resendCode}
                disabled={resendTimer > 0 || isLoading}
                className="w-full text-center text-sm text-gray-500 hover:text-[#dc2743] transition-colors disabled:text-gray-300"
              >
                {resendTimer > 0 ? `Invia di nuovo tra ${resendTimer}s` : 'Invia di nuovo il codice'}
              </button>
              <button onClick={() => setStep('email')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#dc2743] transition-colors mt-4 mx-auto">
                <ArrowLeft className="w-3 h-3" /> Cambia email
              </button>
            </motion.div>
          )}

          {step === 'password' && (
            <motion.div key="password" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="relative mb-4">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nuova password (min. 6 caratteri)"
                  minLength={6}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:border-[#dc2743] focus:ring-2 focus:ring-[#dc2743]/20 outline-none transition-all text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
              <div className="relative mb-4">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Conferma nuova password"
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#dc2743] focus:ring-2 focus:ring-[#dc2743]/20 outline-none transition-all text-sm"
                />
              </div>
              <button
                onClick={resetPassword}
                disabled={isLoading || !password || !confirmPassword}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {isLoading ? 'Reimpostazione...' : 'Reimposta Password'}
              </button>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-normal text-gray-900 mb-2">Password Reimpostata!</h2>
              <p className="text-gray-500 mb-6">Ora puoi accedere con la tua nuova password.</p>
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-medium hover:opacity-90 transition-opacity"
              >
                Vai al Login
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center mt-6 text-sm text-gray-500">
          <Link href="/login" className="text-[#dc2743] hover:underline font-medium">Torna al login</Link>
        </p>
      </div>
    </div>
  )
}
