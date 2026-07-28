import { Geist, Geist_Mono } from 'next/font/google'
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

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
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
      name: 'NextBrand',
      url: 'https://nextbrand.it',
      logo: 'https://nextbrand.it/nextbrand.png',
      description: 'Analisi dei Social Media con Intelligenza Artificiale',
      foundingDate: '2025',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        url: 'https://nextbrand.it/contact',
      },
    },
    {
      '@type': 'WebSite',
      name: 'NextBrand',
      url: 'https://nextbrand.it',
      description: "Analizza e ottimizza la tua presenza su Instagram, TikTok e YouTube con approfondimenti basati sull'IA.",
      inLanguage: 'it-IT',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://nextbrand.it/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export const metadata = {
  metadataBase: new URL('https://nextbrand.it'),
  title: {
    default: 'NextBrand | Analisi Social Media con AI per Instagram, TikTok e YouTube',
    template: '%s | NextBrand',
  },
  description: "Analizza e ottimizza la tua presenza su Instagram, TikTok e YouTube con l'intelligenza artificiale. Ottieni insights, raccomandazioni personalizzate e fai crescere il tuo pubblico.",
  keywords: ['analisi social media', 'analisi Instagram', 'analisi TikTok', 'analisi YouTube', 'IA social media', 'crescita follower', 'analisi engagement', 'social media analytics', 'AI marketing', 'growth hacking'],
  authors: [{ name: 'NextBrand' }],
  creator: 'NextBrand',
  publisher: 'NextBrand',
  alternates: {
    canonical: '/',
    languages: {
      'it-IT': '/it',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://nextbrand.it',
    siteName: 'NextBrand',
    title: 'NextBrand | Analisi Social Media con AI',
    description: "Analizza e ottimizza la tua presenza su Instagram, TikTok e YouTube con approfondimenti basati sull'IA.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NextBrand - Analisi Social Media con AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NextBrand | Analisi Social Media con IA',
    description: "Analizza e ottimizza la tua presenza su Instagram, TikTok e YouTube con approfondimenti basati sull'IA.",
    images: ['/og-image.png'],
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
    icon: '/nextbrand.png',
    apple: '/nextbrand.png',
  },
  manifest: '/manifest.json',
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
