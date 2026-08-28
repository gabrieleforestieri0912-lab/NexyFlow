'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Clock, Send, Loader2, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Errore invio messaggio')
      setSuccess(true)
      setForm({ name: '', email: '', message: '' })
    } catch (err: any) {
      setError(err.message || 'Errore durante l\'invio')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-normal text-gray-900 mb-4">Contattaci</h1>
          <p className="text-gray-600 text-lg">Hai domande? Siamo qui per aiutarti.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 rounded-2xl p-8 text-center"
              >
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-normal text-gray-900 mb-2">Messaggio Inviato!</h3>
                <p className="text-gray-600">Ti risponderemo al più presto.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  type="text"
                  placeholder="Il tuo nome"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#dc2743] focus:ring-2 focus:ring-[#dc2743]/20 outline-none transition-all"
                />
                <input
                  type="email"
                  placeholder="La tua email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#dc2743] focus:ring-2 focus:ring-[#dc2743]/20 outline-none transition-all"
                />
                <textarea
                  placeholder="Il tuo messaggio"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#dc2743] focus:ring-2 focus:ring-[#dc2743]/20 outline-none transition-all resize-none"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {isLoading ? 'Invio in corso...' : 'Invia Messaggio'}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6">
              <Mail className="w-6 h-6 text-[#dc2743] mb-3" />
              <h3 className="font-normal text-gray-900 mb-1">Email</h3>
              <p className="text-gray-600 text-sm">gabriele.forestieri0912@gmail.com</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <Clock className="w-6 h-6 text-[#dc2743] mb-3" />
              <h3 className="font-normal text-gray-900 mb-1">Tempi di Risposta</h3>
              <p className="text-gray-600 text-sm">Entro 24 ore lavorative</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <MessageSquare className="w-6 h-6 text-[#dc2743] mb-3" />
              <h3 className="font-normal text-gray-900 mb-1">Assistenza</h3>
              <p className="text-gray-600 text-sm">Disponibile dal lunedì al venerdì</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
