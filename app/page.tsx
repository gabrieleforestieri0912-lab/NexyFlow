import type { Metadata } from 'next'
import PricingSection from '@/components/PricingSection'
import HeroSection from '@/components/HeroSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import PlatformsSection from '@/components/PlatformsSection'
import FeaturesSection from '@/components/FeaturesSection'
import AIChatSection from '@/components/AIChatSection'
import FAQSection from '@/components/FAQSection'
import Footer from '@/components/Footer'
import { faqs } from '@/lib/faq-data'

export const metadata: Metadata = {
  title: 'Nexyflow | Analisi Social Media con AI per Instagram, TikTok e YouTube',
  description: "Analizza e ottimizza la tua presenza su Instagram, TikTok e YouTube con l'intelligenza artificiale. Ottieni insights, raccomandazioni personalizzate e fai crescere il tuo pubblico.",
  alternates: { canonical: '/' },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="min-h-screen bg-white">
        <HeroSection />
        <AIChatSection />
        <HowItWorksSection />
        <PlatformsSection />
        <FeaturesSection />
        <PricingSection />
        <FAQSection />
        <Footer />
      </div>
    </>
  )
}
