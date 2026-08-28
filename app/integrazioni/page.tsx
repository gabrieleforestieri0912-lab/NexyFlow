import { Metadata } from 'next'
import IntegrationsPage from './IntegrationsPage'

export const metadata: Metadata = {
  title: 'Integrazioni',
  description: 'Connetti Instagram, TikTok e YouTube a Nexyflow e ottieni analisi AI sui tuoi profili social.',
  openGraph: {
    title: 'Integrazioni | Nexyflow',
    description: 'Connetti Instagram, TikTok e YouTube a Nexyflow.',
  },
}

export default function Page() {
  return <IntegrationsPage />
}
