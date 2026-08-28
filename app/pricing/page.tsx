import type { Metadata } from 'next'
import PricingSection from '@/components/PricingSection'

export const metadata: Metadata = {
  title: 'Prezzi',
  description: 'Scegli il piano Nexyflow più adatto alle tue esigenze. Gratuito, Pro, Business o Enterprise.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Nexyflow | Prezzi',
    description: 'Piani Free, Pro, Business ed Enterprise per l\'analisi social media con AI.',
  },
}

const offersJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Nexyflow - Piani di abbonamento',
  description: 'Piani Free, Pro, Business ed Enterprise per l\'analisi dei social media con intelligenza artificiale.',
  brand: { '@type': 'Brand', name: 'Nexyflow' },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'EUR',
    lowPrice: '0',
    highPrice: '29.99',
    offerCount: 4,
    offers: [
      {
        '@type': 'Offer',
        name: 'Free',
        price: '0',
        priceCurrency: 'EUR',
        url: 'https://nexyflow.it/pricing',
        description: '3 query AI al giorno, analisi di base, 1 piattaforma social, report settimanali.',
      },
      {
        '@type': 'Offer',
        name: 'Pro',
        price: '9.99',
        priceCurrency: 'EUR',
        url: 'https://nexyflow.it/pricing',
        description: 'Query AI illimitate, analisi avanzate, 2 piattaforme, Content Generator AI.',
      },
      {
        '@type': 'Offer',
        name: 'Business',
        price: '19.99',
        priceCurrency: 'EUR',
        url: 'https://nexyflow.it/pricing',
        description: 'Tutte le piattaforme, fino a 3 membri del team, analisi competitor avanzata.',
      },
      {
        '@type': 'Offer',
        name: 'Enterprise',
        price: '29.99',
        priceCurrency: 'EUR',
        url: 'https://nexyflow.it/pricing',
        description: 'API access, team illimitato, account manager dedicato, SLA garantito.',
      },
    ],
  },
}

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersJsonLd) }}
      />
      <PricingSection />
    </>
  )
}