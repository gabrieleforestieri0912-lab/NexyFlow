import type { Metadata } from 'next'
import { features } from '@/lib/features-data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return features.map((feature) => ({ slug: feature.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const feature = features.find((f) => f.slug === slug)
  if (!feature) return {}
  return {
    title: `${feature.title} | Nexyflow`,
    description: feature.longDescription,
    alternates: { canonical: `/features/${feature.slug}` },
  }
}

export default async function FeaturePage({ params }: PageProps) {
  const { slug } = await params
  const feature = features.find((f) => f.slug === slug)

  if (!feature) return notFound()

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nexyflow.it/' },
      { '@type': 'ListItem', position: 2, name: feature.title, item: `https://nexyflow.it/features/${feature.slug}` },
    ],
  }

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Nexyflow - ${feature.title}`,
    description: feature.longDescription,
    url: `https://nexyflow.it/features/${feature.slug}`,
    provider: { '@type': 'Organization', name: 'Nexyflow', url: 'https://nexyflow.it' },
    areaServed: 'IT',
    audience: { '@type': 'Audience', audienceType: 'Social media creators and marketers' },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbLd, productLd]) }}
      />
      <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          href="/#features"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8"
        >
          <ArrowLeft size={16} />
          Torna alle funzionalità
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <div
            className="p-3 rounded-xl"
            style={{ background: `${feature.accentColor}12` }}
          >
            <feature.icon size={32} style={{ color: feature.accentColor }} />
          </div>
          <h1 className="text-4xl font-normal text-gray-900">{feature.title}</h1>
        </div>

        <p className="text-lg text-gray-600 mb-8">{feature.longDescription}</p>

        {feature.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {feature.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm font-medium px-3 py-1.5 rounded-full"
                style={{
                  background: `${feature.accentColor}10`,
                  color: feature.accentColor,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-normal text-gray-900 mb-4">Vantaggi</h2>
            <ul className="space-y-3">
              {feature.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-normal text-gray-900 mb-4">Come funziona</h2>
            <ul className="space-y-3">
              {feature.howItWorks.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-normal text-gray-600 mt-0.5 flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-2xl text-white font-medium hover:shadow-2xl hover:shadow-red-500/30 transition-all"
          >
            Inizia Gratis
          </Link>
        </div>
      </div>
      </div>
    </>
  )
}
