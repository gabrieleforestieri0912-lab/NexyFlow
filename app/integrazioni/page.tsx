import { Metadata } from 'next'
import IntegrationsPage from './IntegrationsPage'

export const metadata: Metadata = {
  title: 'Integrazioni',
  description: 'Connetti Instagram, TikTok e YouTube a NextBrand e ottieni analisi AI sui tuoi profili social.',
  openGraph: {
    title: 'Integrazioni | NextBrand',
    description: 'Connetti Instagram, TikTok e YouTube a NextBrand.',
  },
}

export default function Page() {
  return <IntegrationsPage />
}
