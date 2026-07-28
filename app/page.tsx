'use client'

import React from 'react'
import PricingSection from '@/components/PricingSection'
import HeroSection from '@/components/HeroSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import PlatformsSection from '@/components/PlatformsSection'
import FeaturesSection from '@/components/FeaturesSection'
import AIChatSection from '@/components/AIChatSection'
import FAQSection from '@/components/FAQSection'
import Footer from '@/components/Footer'
import ExtensionSection from '@/components/ExtensionSection'
import { useAuth } from '@/context/AuthContext'

export default function Home() {
  const { user, loading } = useAuth()
  if (loading) {
    return <div className="min-h-screen bg-white pt-16"><div className="h-96 animate-pulse bg-gray-100 rounded-2xl mx-4"></div></div>
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <HeroSection />
      <AIChatSection />
      <HowItWorksSection />
      <PlatformsSection />
      <FeaturesSection />
      <ExtensionSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  )
}
