import { NextResponse } from 'next/server'
import supabase from '@/lib/supabase'
import { sendWeeklyReport } from '@/lib/email'

export async function GET() {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, social_stats, plan')
      .eq('onboarding_completed', true)

    if (error) throw error

    const results = { sent: 0, failed: 0 }

    for (const user of users) {
      if (!user.email) continue

      const stats = user.social_stats as Record<string, any> | null
      const followers = stats?.instagram?.followers || 0
      const views = stats?.tiktok?.views || stats?.youtube?.views || 0
      const engagement = stats?.instagram?.engagement || stats?.tiktok?.engagement || 0
      const growth = 0

      try {
        await sendWeeklyReport(user.name, user.email, { followers, views, engagement, growth })
        results.sent++
      } catch {
        results.failed++
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('Weekly report error:', error)
    return NextResponse.json({ error: 'Failed to send reports' }, { status: 500 })
  }
}
