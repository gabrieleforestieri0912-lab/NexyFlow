import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-normal bg-linear-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-2xl font-normal text-gray-900 mb-2">Pagina non trovata</h1>
        <p className="text-gray-600 mb-8">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 rounded-xl bg-linear-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-medium hover:opacity-90 transition-opacity"
        >
          Torna alla Home
        </Link>
      </div>
    </div>
  )
}
