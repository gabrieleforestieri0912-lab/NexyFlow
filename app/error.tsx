'use client'

import { TriangleAlert } from 'lucide-react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-4 flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
            <TriangleAlert className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <h1 className="text-2xl font-normal text-gray-900 mb-2">Qualcosa è andato storto</h1>
        <p className="text-gray-600 mb-8">
          Si è verificato un errore imprevisto. Riprova o contattaci se il problema persiste.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-medium hover:opacity-90 transition-opacity"
        >
          Riprova
        </button>
      </div>
    </div>
  )
}
