'use client'

const platforms = [
  {
    name: 'Instagram',
    color: 'from-purple-500 via-pink-500 to-orange-400',
    icon: () => (
      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
      </svg>
    ),
    features: ['Analisi follower e engagement', 'Ottimizzazione Reels', 'Migliori orari di pubblicazione', 'Analisi competitor'],
  },
  {
    name: 'TikTok',
    color: 'bg-black',
    icon: () => (
      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
    features: ['Analisi trend virali', 'Strategie di crescita', 'Ottimizzazione hashtag', 'Analisi performance video'],
  },
  {
    name: 'YouTube',
    color: 'bg-white',
    icon: () => (
      <svg className="w-8 h-8 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    features: ['Analisi canale e video', 'SEO per titoli e descrizioni', 'Analisi retention pubblico', 'Strategie di monetizzazione'],
  },
]

export default function PlatformsSection() {
  return (
    <section className="relative py-24 px-4" id="platforms">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-normal text-gray-900 mb-4">
            Supportiamo le <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]">principali piattaforme</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Analisi approfondite e strategie personalizzate per ogni piattaforma social.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {platforms.map((platform, index) => (
            <div
              key={index}
              className="group bg-white border border-gray-200 rounded-2xl p-6 hover:bg-gray-50 transition-all shadow-sm"
            >
              <div className={`w-14 h-14 rounded-2xl ${platform.color} flex items-center justify-center mb-5`}>
                <platform.icon />
              </div>
              <h3 className="text-2xl font-normal text-gray-900 mb-4">{platform.name}</h3>
              <ul className="space-y-3">
                {platform.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-3 text-gray-600">
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${platform.color}`} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
