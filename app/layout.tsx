import { Geist } from 'next/font/google'
import './globals.css'
import { GAProvider } from '@/components/GAProvider'
import { AuthProvider } from '@/context/AuthContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { ToastProvider } from '@/context/ToastContext'
import NavbarWrapper from '@/components/NavbarWrapper'
import CommandPalette from '@/components/CommandPalette'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#E4405F',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://nexyflow.it/#organization',
      name: 'Nexyflow',
      url: 'https://nexyflow.it',
      logo: 'https://nexyflow.it/nexyflow.png',
      description: 'Nexyflow è una piattaforma di analisi dei social media basata sull\'intelligenza artificiale per Instagram, TikTok e YouTube.',
      foundingDate: '2025',
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'hello@nexyflow.it',
          url: 'https://nexyflow.it/contact',
          areaServed: 'IT',
          availableLanguage: ['Italian', 'English'],
        },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://nexyflow.it/#website',
      url: 'https://nexyflow.it',
      name: 'Nexyflow',
      description: "Analizza e ottimizza la tua presenza su Instagram, TikTok e YouTube con approfondimenti basati sull'IA.",
      inLanguage: 'it-IT',
      publisher: { '@id': 'https://nexyflow.it/#organization' },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://nexyflow.it/#software',
      name: 'Nexyflow',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: 'https://nexyflow.it',
      description: "Piattaforma all-in-one di analisi social media con intelligenza artificiale. Ottieni insights su Instagram, TikTok e YouTube, strategie di crescita personalizzate e contenuti generati dall'AI.",
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: '0',
        highPrice: '29.99',
        priceCurrency: 'EUR',
        offerCount: 4,
        offers: [
          { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'EUR', url: 'https://nexyflow.it/pricing' },
          { '@type': 'Offer', name: 'Pro', price: '9.99', priceCurrency: 'EUR', url: 'https://nexyflow.it/pricing' },
          { '@type': 'Offer', name: 'Business', price: '19.99', priceCurrency: 'EUR', url: 'https://nexyflow.it/pricing' },
          { '@type': 'Offer', name: 'Enterprise', price: '29.99', priceCurrency: 'EUR', url: 'https://nexyflow.it/pricing' },
        ],
      },
    },
    {
      '@type': 'WebPage',
      '@id': 'https://nexyflow.it/#webpage',
      url: 'https://nexyflow.it',
      name: 'Nexyflow | Analisi Social Media con AI',
      description: "Analizza e ottimizza la tua presenza su Instagram, TikTok e YouTube con l'intelligenza artificiale.",
      inLanguage: 'it-IT',
      isPartOf: { '@id': 'https://nexyflow.it/#website' },
    },
  ],
}

export const metadata = {
  metadataBase: new URL('https://nexyflow.it'),
  title: {
    default: 'Nexyflow | Analisi Social Media con AI per Instagram, TikTok e YouTube',
    template: '%s | Nexyflow',
  },
  description: "Analizza e ottimizza la tua presenza su Instagram, TikTok e YouTube con l'intelligenza artificiale. Ottieni insights, raccomandazioni personalizzate e fai crescere il tuo pubblico.",
  keywords: ['analisi social media', 'analisi Instagram', 'analisi TikTok', 'analisi YouTube', 'IA social media', 'crescita follower', 'analisi engagement', 'social media analytics', 'AI marketing', 'growth hacking', 'tool analisi social', 'analisi profilo instagram gratis', 'aumentare follower', 'strategie contenuti AI', 'social media growth'],
  category: 'social media analytics',
  authors: [{ name: 'Nexyflow', url: 'https://nexyflow.it' }],
  creator: 'Nexyflow',
  publisher: 'Nexyflow',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://nexyflow.it',
    siteName: 'Nexyflow',
    title: 'Nexyflow | Analisi Social Media con AI',
    description: "Analizza e ottimizza la tua presenza su Instagram, TikTok e YouTube con approfondimenti basati sull'IA.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexyflow | Analisi Social Media con IA',
    description: "Analizza e ottimizza la tua presenza su Instagram, TikTok e YouTube con approfondimenti basati sull'IA.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/nexyflow.png',
    apple: '/nexyflow.png',
  },
  other: {
    chatbot: 'index',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} antialiased bg-white relative`}
      >
        <svg className="glass-defs" width="0" height="0" aria-hidden="true" focusable="false">
          <defs>
            <filter id="liquid-glass-refraction"
                    x="-30%" y="-30%" width="160%" height="160%"
                    colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.012 0.015" numOctaves="3" result="noise" />
              <feColorMatrix in="SourceAlpha" type="matrix" result="boosted_alpha"
                values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 100 0" />
              <feGaussianBlur in="boosted_alpha" stdDeviation="45" result="blurred_alpha" />
              <feComponentTransfer in="blurred_alpha" result="edge_mask">
                <feFuncA type="linear" slope="-1.3" intercept="1" />
              </feComponentTransfer>
              <feComposite in="noise" in2="edge_mask" operator="arithmetic"
                           k1="1" k2="0" k3="0" k4="0" result="masked_noise" />
              <feDisplacementMap in="SourceGraphic" in2="masked_noise" scale="65"
                                 xChannelSelector="R" yChannelSelector="G" result="red_displaced" />
              <feColorMatrix in="red_displaced" type="matrix" result="red"
                values="1 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 1 0" />
              <feDisplacementMap in="SourceGraphic" in2="masked_noise" scale="56"
                                 xChannelSelector="R" yChannelSelector="G" result="green_displaced" />
              <feColorMatrix in="green_displaced" type="matrix" result="green"
                values="0 0 0 0 0
                        0 1 0 0 0
                        0 0 0 0 0
                        0 0 0 1 0" />
              <feDisplacementMap in="SourceGraphic" in2="masked_noise" scale="47"
                                 xChannelSelector="R" yChannelSelector="G" result="blue_displaced" />
              <feColorMatrix in="blue_displaced" type="matrix" result="blue"
                values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 1 0 0
                        0 0 0 1 0" />
              <feBlend in="red" in2="green" mode="screen" result="rg" />
              <feBlend in="rg" in2="blue" mode="screen" result="chromatic_dispersion" />
            </filter>
          </defs>
        </svg>
        <div className="absolute inset-0 pointer-events-none z-1 will-change-transform opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'1\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
        <GAProvider>
        <AuthProvider>
          <LanguageProvider>
          <ToastProvider>
          <NavbarWrapper>
            <CommandPalette />
            {children}
          </NavbarWrapper>
          </ToastProvider>
        </LanguageProvider>
          </AuthProvider>
        </GAProvider>
      </body>
    </html>
  )
}
