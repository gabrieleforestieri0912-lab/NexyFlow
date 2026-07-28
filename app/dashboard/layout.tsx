export const metadata = {
  title: 'Dashboard',
  description: 'La tua dashboard NextBrand — monitora le analisi dei social media, le piattaforme collegate e le metriche di crescita in un unico posto.',
  robots: { index: false, follow: false },
}

import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import OnboardingWizard from '@/components/OnboardingWizard'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OnboardingWizard />
      <div className="min-h-screen relative overflow-hidden" style={{ background: '#09090f', backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(220,39,67,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(139,92,246,0.06) 0%, transparent 60%)' }}>
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-[#dc2743]/20 to-[#f09433]/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-tr from-[#8b5cf6]/15 to-[#69C9D0]/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#dc2743]/5 blur-[100px] rounded-full" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundSize: '80px 80px', backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)' }} />
        <div className="absolute inset-0 opacity-[0.025] will-change-transform" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'1\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
      </div>

      <Sidebar />
      <main className="lg:pl-64 pt-16 pb-24 lg:pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
    </>
  )
}
