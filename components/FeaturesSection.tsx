'use client'

import { useEffect, useRef, useState } from 'react'
import { BarChart3, Target, Zap, TrendingUp, Brain, Shield, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { features, type Feature } from '@/lib/features-data'

function MiniBar({ color, height }: { color: string; height: number }) {
  return (
    <div
      className="w-1.5 rounded-full flex-shrink-0"
      style={{
        height: `${height}px`,
        background: color,
        opacity: 0.7,
      }}
    />
  )
}

function FeatureCard({ feature, delay }: { feature: Feature; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  const IconComp = feature.icon

  return (
    <Link
      href={`/features/${feature.slug}`}
      className={`${feature.colSpan} relative group block`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      <div
        ref={ref}
        className="relative h-full rounded-2xl border border-gray-200 bg-white p-6 flex flex-col transition-all duration-200 hover:bg-gray-50"
        style={{
          boxShadow: hovered
            ? '0 12px 40px -12px rgba(0,0,0,0.1)'
            : '0 1px 2px rgba(0,0,0,0.04)',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Icon */}
        <div
          className="flex items-center justify-center rounded-xl mb-4 transition-all duration-200"
          style={{
            width: feature.big ? 52 : 44,
            height: feature.big ? 52 : 44,
            background: `${feature.accentColor}12`,
          }}
        >
          <IconComp
            size={feature.big ? 24 : 20}
            style={{ color: feature.accentColor }}
          />
        </div>

        {/* Title + Arrow */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className={`font-normal text-gray-900 leading-tight ${feature.big ? 'text-2xl' : 'text-lg'}`}>
            {feature.title}
          </h3>
          {!feature.wide && (
            <ArrowRight
              size={16}
              style={{ color: feature.accentColor }}
              className={`flex-shrink-0 mt-1 transition-all duration-200 ${
                hovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
              }`}
            />
          )}
        </div>

        {/* Description */}
        <p className={`text-gray-600 leading-relaxed mb-auto ${feature.big ? 'text-base' : 'text-sm'}`}>
          {feature.description}
        </p>

        {/* Big card: mini chart */}
        {feature.big && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-end gap-1 h-10">
              {[18, 28, 22, 35, 30, 42, 38, 50, 44, 58].map((h, i) => (
                <MiniBar key={i} color={feature.accentColor} height={h * 0.7} />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">Crescita ultimi 10 giorni</p>
          </div>
        )}

        {/* Tags */}
        {feature.tags && (
          <div className="mt-4 flex flex-wrap gap-2">
            {feature.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-3 py-1.5 rounded-full"
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
      </div>
    </Link>
  )
}

export default function FeaturesSection() {
  return (
    <section className="relative py-24 px-4 bg-gray-50/50" id="features">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-5">
            <Zap size={14} className="text-red-500" />
            <span className="text-sm font-normal text-red-400">Funzionalità</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-normal text-gray-900 mb-5 tracking-tight leading-tight">
            Tutto ciò che ti serve{' '}
            <br className="hidden md:block" />
            per{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]">
              crescere
            </span>
          </h2>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Una suite completa di strumenti per analizzare, ottimizzare e far crescere
            la tua presenza sui social media.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-4 md:gap-5 items-stretch [&>*]:min-h-[200px]">
          {features.map((feature, i) => (
            <FeatureCard key={feature.slug} feature={feature} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  )
}
