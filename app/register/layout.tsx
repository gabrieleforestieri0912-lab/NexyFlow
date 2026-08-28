export const metadata = {
  title: 'Register',
  description: 'Create your free Nexyflow account and start growing your social media with AI-powered analytics.',
  robots: { index: false, follow: false },
}

import AuthLayout from '../auth-layout'

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>
}
