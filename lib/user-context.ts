import SocialMetrics from '@/models/SocialMetrics'
import SocialPost from '@/models/SocialPost'
import type { UserData, ConnectedPlatforms } from '@/models/User'

const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']

function dayLabel(dateStr: string): string {
  const d = new Date(dateStr)
  const idx = d.getDay() === 0 ? 6 : d.getDay() - 1
  return DAY_LABELS[idx] || DAY_LABELS[0]
}

async function buildPlatformContext(user: UserData, platform: 'instagram' | 'tiktok' | 'youtube'): Promise<string> {
  const platforms: ConnectedPlatforms = user.connected_platforms ?? { instagram: false, tiktok: false, youtube: false }
  const name = platform === 'instagram' ? 'Instagram' : platform === 'tiktok' ? 'TikTok' : 'YouTube'
  if (!platforms[platform]) return `${name}: not connected`

  const s = user.social_stats?.[platform]
  const isYT = platform === 'youtube'
  const followers = isYT ? s?.subscribers ?? 0 : s?.followers ?? 0
  const views = s?.views ?? 0
  const engagement = s?.engagement ?? 0
  const videos = s?.videos ?? 0

  const posts = await SocialPost.getTopByViews(user.id, platform, 5)
  const metrics = await SocialMetrics.getRecent(user.id, platform, 7)

  let likes: number
  let comments: number
  if (posts.length > 0) {
    likes = posts.reduce((a, p) => a + (p.likes || 0), 0)
    comments = posts.reduce((a, p) => a + (p.comments || 0), 0)
  } else {
    likes = isYT ? Math.floor(views * 0.02) : Math.floor(followers * 0.05)
    comments = isYT ? Math.floor(views * 0.002) : Math.floor(followers * 0.005)
  }

  const lines = [
    `${name}: followers ${followers.toLocaleString()}, views ${views.toLocaleString()}, engagement ${engagement}%, videos ${videos}, likes (top content) ${likes.toLocaleString()}, comments (top content) ${comments.toLocaleString()}`,
  ]

  if (metrics.length >= 2) {
    const first = metrics[0]
    const last = metrics[metrics.length - 1]
    const f0 = isYT ? first.subscribers : first.followers
    const f1 = isYT ? last.subscribers : last.followers
    const delta = f1 - f0
    lines.push(`  7-day trend: ${f0.toLocaleString()} → ${f1.toLocaleString()} followers (${delta >= 0 ? '+' : ''}${delta.toLocaleString()}), views ${first.views.toLocaleString()} → ${last.views.toLocaleString()}, days: ${metrics.map((m) => dayLabel(m.metric_date)).join(', ')}`)
  }

  if (posts.length > 0) {
    lines.push('  Top content:')
    for (const p of posts) {
      const title = (p.title || '(senza titolo)').slice(0, 70)
      lines.push(`    - ${title}: views ${(p.views || 0).toLocaleString()}, likes ${(p.likes || 0).toLocaleString()}, comments ${(p.comments || 0).toLocaleString()}`)
    }
  }

  return lines.join('\n')
}

export async function buildUserContext(user: UserData): Promise<string> {
  const igLine = await buildPlatformContext(user, 'instagram')
  const ttLine = await buildPlatformContext(user, 'tiktok')
  const ytLine = await buildPlatformContext(user, 'youtube')

  return `USER CONTEXT (read-only, do not modify):
- Name: ${user.name || 'Unknown'}
- Plan: ${user.plan || 'free'}
- Language: ${user.language || 'it'}
- Created: ${user.created_at || 'unknown'}
Connected platforms (aggregate):
- ${igLine}
- ${ttLine}
- ${ytLine}

Use this data to answer, analyze and suggest. Mention specific likes, comments and top content when relevant to keep the user updated on their performance.`
}
