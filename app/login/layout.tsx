export const metadata = {
  title: 'Login',
  description: 'Sign in to Nexyflow to access your AI-powered social media analytics dashboard.',
  robots: { index: false, follow: false },
}

import AuthLayout from '../auth-layout'

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>
}
