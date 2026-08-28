'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { GoogleAnalytics as NextGALib } from '@next/third-parties/google'

const gaId = process.env.NEXT_PUBLIC_GA_ID

function GAPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && gaId && typeof window !== 'undefined' && (window as any).gtag) {
      let url = pathname
      if (searchParams?.toString()) url += '?' + searchParams.toString()
      ;(window as any).gtag('config', gaId, { page_path: url })
    }
  }, [pathname, searchParams])

  return null
}

export function GAProvider({ children }: { children: React.ReactNode }) {
  if (!gaId) return <>{children}</>

  return (
    <>
      <NextGALib gaId={gaId} />
      <GAPageView />
      {children}
    </>
  )
}

export function trackGAEvent(action: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', action, params)
  }
}

export function identifyGA(params?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('set', 'user_properties', params)
  }
}
