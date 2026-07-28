'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import Navbar from './Navbar'

export default function NavbarWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const hiddenPaths = ['/login', '/register', '/chat', '/popup', '/contact', '/dashboard']

  if (hiddenPaths.some(p => pathname.startsWith(p))) return <>{children}</>

  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
