import PricingSection from '@/components/PricingSection'

export const metadata = {
  title: 'Prezzi',
  description: 'Scegli il piano NextBrand più adatto alle tue esigenze. Gratuito, Pro o Enterprise.',
  openGraph: {
    title: 'NextBrand | Prezzi',
    description: 'Scegli il piano NextBrand più adatto alle tue esigenze.',
  },
}

export default function PricingPage() {
  return <PricingSection />
}
