import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import User from '@/models/User'
import SocialMetrics from '@/models/SocialMetrics'
import SocialPost from '@/models/SocialPost'

const getDeterministicNoise = (seed: string, index: number): number => {
  let hash = 0
  const key = seed + index.toString()
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash % 1000) / 1000
}

const generateInstagramDetailed = (stats: any, userId: string) => {
  const followers = stats.followers || 12500
  const noise = (i: number) => getDeterministicNoise(userId + 'ig', i)
  const days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
  const posts = stats.videos || 84

  return {
    followers,
    following: Math.floor(followers * (0.2 + noise(1) * 0.3)),
    posts,
    engagement: stats.engagement || 3.8,
    avgLikes: Math.floor(followers * (0.03 + noise(2) * 0.02)),
    avgComments: Math.floor(followers * (0.002 + noise(3) * 0.003)),
    storyCompletionRate: parseFloat((60 + noise(4) * 30).toFixed(1)),
    reach: Math.floor(followers * (2.5 + noise(5) * 1.5)),
    impressions: Math.floor(followers * (4 + noise(6) * 2)),
    profileVisits: Math.floor(followers * (0.08 + noise(7) * 0.05)),
    contentMix: {
      photos: Math.floor(posts * (0.35 + noise(8) * 0.1)),
      videos: Math.floor(posts * (0.4 + noise(9) * 0.1)),
      carousels: Math.floor(posts * (0.15 + noise(10) * 0.1)),
    },
    reels: {
      count: Math.floor(posts * (0.45 + noise(13) * 0.15)),
      avgViews: Math.floor(followers * (2 + noise(14) * 2)),
      avgLikes: Math.floor(followers * (0.05 + noise(15) * 0.04)),
      avgComments: Math.floor(followers * (0.004 + noise(16) * 0.005)),
      engagementRate: parseFloat((4.5 + noise(17) * 3.5).toFixed(1)),
    },
    topPosts: Array.from({ length: 5 }, (_, i) => ({
      id: `ig_${i}`,
      type: ['photo', 'video', 'carousel', 'reel', 'video'][i],
      views: Math.floor(followers * (1.2 + noise(22 + i) * 2)),
      likes: Math.floor(followers * (0.04 + noise(20 + i) * 0.03)),
      comments: Math.floor(followers * (0.003 + noise(30 + i) * 0.004)),
      date: `2026-0${7 + i}-${10 + i * 2}`,
    })),
    bestPostingTime: ['18:00-20:00', '12:00-14:00', '20:00-22:00'][Math.floor(noise(11) * 3)],
    growthRate: parseFloat((1.2 + noise(12) * 2.5).toFixed(1)),
    followerHistory: days.map((d, i) => ({
      name: d,
      value: Math.floor(followers - (6 - i) * Math.floor(followers * 0.001) + (noise(40 + i) - 0.5) * Math.floor(followers * 0.0005)),
    })),
    engagementHistory: days.map((d, i) => ({
      name: d,
      value: Math.round(((stats.engagement || 3.8) * (0.85 + noise(50 + i) * 0.3)) * 10) / 10,
    })),
  }
}

const generateTikTokDetailed = (stats: any, userId: string) => {
  const followers = stats.followers || 28000
  const totalViews = stats.views || 450000
  const noise = (i: number) => getDeterministicNoise(userId + 'tt', i)
  const days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']

  return {
    followers,
    following: Math.floor(followers * (0.08 + noise(1) * 0.1)),
    likes: Math.floor(totalViews * (0.05 + noise(2) * 0.03)),
    videos: stats.videos || 142,
    engagement: stats.engagement || 6.2,
    avgWatchTime: parseFloat((30 + noise(3) * 25).toFixed(1)),
    completionRate: parseFloat((25 + noise(4) * 20).toFixed(1)),
    shareRate: parseFloat((2 + noise(5) * 3).toFixed(1)),
    commentRate: parseFloat((1.5 + noise(6) * 2).toFixed(1)),
    profileViews: Math.floor(followers * (0.12 + noise(7) * 0.08)),
    trendingVideos: Array.from({ length: 5 }, (_, i) => ({
      id: `tt_${i}`,
      plays: Math.floor(totalViews * (0.02 + noise(20 + i) * 0.04)),
      likes: Math.floor(totalViews * (0.001 + noise(30 + i) * 0.002)),
      shares: Math.floor(totalViews * (0.0003 + noise(40 + i) * 0.0005)),
      comments: Math.floor(totalViews * (0.0002 + noise(50 + i) * 0.0003)),
      date: `2026-0${7 + i}-${15 + i * 3}`,
    })),
    topHashtags: [
      { tag: '#fyp', count: Math.floor(5 + noise(11) * 10) },
      { tag: '#viral', count: Math.floor(3 + noise(12) * 8) },
      { tag: '#trending', count: Math.floor(2 + noise(13) * 6) },
      { tag: '#foryou', count: Math.floor(4 + noise(14) * 7) },
      { tag: '#contentcreator', count: Math.floor(1 + noise(15) * 5) },
    ],
    bestPostingTime: ['19:00-22:00', '12:00-15:00', '21:00-23:00'][Math.floor(noise(16) * 3)],
    growthRate: parseFloat((3.5 + noise(17) * 4).toFixed(1)),
    followerHistory: days.map((d, i) => ({
      name: d,
      value: Math.floor(followers - (6 - i) * Math.floor(followers * 0.003) + (noise(60 + i) - 0.5) * Math.floor(followers * 0.001)),
    })),
    engagementHistory: days.map((d, i) => ({
      name: d,
      value: Math.round(((stats.engagement || 6.2) * (0.8 + noise(70 + i) * 0.4)) * 10) / 10,
    })),
  }
}

async function buildRealHistory(
  userId: string,
  platforms: ('instagram' | 'tiktok' | 'youtube')[],
  days = 7
): Promise<{ name: string; followers: number; views: number }[]> {
  const dayLabels = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
  const allMetrics: { metric_date: string; followers: number; views: number }[] = []

  for (const platform of platforms) {
    const metrics = await SocialMetrics.getRecent(userId, platform, days)
    metrics.forEach(m => {
      const followers = platform === 'youtube' ? m.subscribers : m.followers
      allMetrics.push({ metric_date: m.metric_date, followers, views: m.views })
    })
  }

  if (allMetrics.length === 0) return []

  const grouped = new Map<string, { followers: number; views: number }>()
  allMetrics.forEach(m => {
    const existing = grouped.get(m.metric_date) || { followers: 0, views: 0 }
    grouped.set(m.metric_date, {
      followers: existing.followers + m.followers,
      views: existing.views + m.views,
    })
  })

  return Array.from(grouped.entries())
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([date, values]) => {
      const dayIndex = new Date(date).getDay()
      return {
        name: dayLabels[dayIndex === 0 ? 6 : dayIndex - 1],
        followers: values.followers,
        views: values.views,
      }
    })
}

async function buildRealYouTubeHistory(userId: string, currentSubscribers: number, currentViews: number) {
  const realMetrics = await SocialMetrics.getRecent(userId, 'youtube', 7)
  const days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']

  if (realMetrics.length >= 2) {
    const subscriberHistory = realMetrics.map(m => ({
      name: days[new Date(m.metric_date).getDay() === 0 ? 6 : new Date(m.metric_date).getDay() - 1] || days[0],
      value: m.subscribers,
    }))
    const viewsHistory = realMetrics.map(m => ({
      name: days[new Date(m.metric_date).getDay() === 0 ? 6 : new Date(m.metric_date).getDay() - 1] || days[0],
      value: m.views,
    }))
    return { subscriberHistory, viewsHistory }
  }

  const noise = (i: number) => getDeterministicNoise(userId + 'yt', i)
  return {
    subscriberHistory: days.map((d, i) => ({
      name: d,
      value: Math.floor(currentSubscribers - (6 - i) * Math.floor(currentSubscribers * 0.0008) + (noise(50 + i) - 0.5) * Math.floor(currentSubscribers * 0.0003)),
    })),
    viewsHistory: days.map((d, i) => ({
      name: d,
      value: Math.floor(currentViews / 7 * (0.75 + noise(60 + i) * 0.5)),
    })),
  }
}

const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']

function dayLabel(dateStr: string): string {
  const d = new Date(dateStr)
  const idx = d.getDay() === 0 ? 6 : d.getDay() - 1
  return DAY_LABELS[idx] || DAY_LABELS[0]
}

async function getPlatformEngagement(
  userId: string,
  platform: 'instagram' | 'tiktok' | 'youtube',
  stats: any,
  isYouTube: boolean
) {
  const posts = await SocialPost.getRecent(userId, platform, 50)
  if (posts.length > 0) {
    return {
      likes: posts.reduce((a, p) => a + (p.likes || 0), 0),
      comments: posts.reduce((a, p) => a + (p.comments || 0), 0),
      shares: posts.reduce((a, p) => a + (p.shares || 0), 0),
      recentPosts: posts.slice(0, 5).map((p) => ({
        id: p.post_id,
        title: p.title || (isYouTube ? 'Video YouTube' : platform === 'instagram' ? 'Reel / Post' : 'Video TikTok'),
        platform,
        views: p.views || 0,
        likes: p.likes || 0,
        comments: p.comments || 0,
        shares: p.shares || 0,
        date: p.published_at ? p.published_at.split('T')[0] : '',
      })),
    }
  }

  const base = isYouTube ? stats?.subscribers || 0 : stats?.followers || 0
  const views = stats?.views || 0
  const likes = isYouTube ? Math.floor(views * 0.02) : Math.floor(base * 0.05)
  const comments = isYouTube ? Math.floor(views * 0.002) : Math.floor(base * 0.005)
  return { likes, comments, shares: Math.floor(base * 0.002), recentPosts: [] }
}

async function buildPlatformHistories(
  userId: string,
  platforms: ('instagram' | 'tiktok' | 'youtube')[],
  stats: any,
  days = 7
): Promise<Record<string, { name: string; followers: number; views: number }[]>> {
  const result: Record<string, { name: string; followers: number; views: number }[]> = {}

  for (const platform of platforms) {
    const real = await SocialMetrics.getRecent(userId, platform, days)
    if (real.length >= 2) {
      result[platform] = real.map((m) => ({
        name: dayLabel(m.metric_date),
        followers: platform === 'youtube' ? m.subscribers || m.followers : m.followers,
        views: m.views,
      }))
      continue
    }

    const base = platform === 'youtube' ? stats[platform]?.subscribers || 0 : stats[platform]?.followers || 0
    const views = stats[platform]?.views || 0
    const noise = (i: number) => getDeterministicNoise(userId + platform, i)
    result[platform] = DAY_LABELS.map((name, i) => ({
      name,
      followers: Math.max(0, Math.floor(base - (6 - i) * Math.max(1, Math.floor(base * 0.0012)) + (noise(i) - 0.5) * Math.max(1, Math.floor(base * 0.0003)))),
      views: Math.max(0, Math.floor((views / 7) * (0.8 + noise(i + 10) * 0.5))),
    }))
  }

  return result
}

const generateYouTubeDetailed = async (stats: any, userId: string) => {
  const subscribers = stats.subscribers || 8500
  const totalViews = stats.views || 320000
  const noise = (i: number) => getDeterministicNoise(userId + 'yt', i)

  const realVideos = await SocialPost.getTopByViews(userId, 'youtube', 5)
  let topVideos = realVideos.map(video => ({
    id: video.post_id,
    title: video.title,
    views: video.views,
    likes: video.likes,
    comments: video.comments,
    date: video.published_at ? new Date(video.published_at).toISOString().split('T')[0] : '',
    thumbnail: video.thumbnail,
  }))

  if (topVideos.length === 0) {
    topVideos = Array.from({ length: 5 }, (_, i) => ({
      id: `yt_${i}`,
      title: ['Video più popolare', 'Tutorial avanzato', 'Recensione prodotto', 'Vlog settimanale', 'Dietro le quinte'][i],
      views: Math.floor(totalViews * (0.05 + noise(20 + i) * 0.08)),
      likes: Math.floor(totalViews * (0.002 + noise(30 + i) * 0.003)),
      comments: Math.floor(totalViews * (0.0002 + noise(40 + i) * 0.0003)),
      date: `2026-0${6 + i}-${5 + i * 7}`,
      thumbnail: '',
    }))
  }

  const totalLikes = topVideos.reduce((sum, v) => sum + (v.likes || 0), 0)
  const totalComments = topVideos.reduce((sum, v) => sum + (v.comments || 0), 0)
  const avgViewDuration = parseFloat((4 + noise(1) * 6).toFixed(1))
  const { subscriberHistory, viewsHistory } = await buildRealYouTubeHistory(userId, subscribers, totalViews)

  return {
    subscribers,
    views: totalViews,
    videos: stats.videos || 63,
    engagement: stats.engagement || 5.1,
    avgViewDuration,
    watchTime: Math.floor(totalViews * avgViewDuration),
    likes: totalLikes,
    comments: totalComments,
    impressions: Math.floor(totalViews * 2),
    clickThroughRate: parseFloat((4 + noise(6) * 4).toFixed(1)),
    trafficSources: [
      { source: 'YouTube Ricerca', percentage: 35 + noise(7) * 15 },
      { source: 'Video correlati', percentage: 15 + noise(8) * 10 },
      { source: 'Homepage', percentage: 10 + noise(9) * 8 },
      { source: 'Notifiche', percentage: 5 + noise(10) * 5 },
      { source: 'Esterno', percentage: 3 + noise(11) * 5 },
    ].map(s => ({ ...s, percentage: Math.round(s.percentage) })),
    topVideos,
    uploadFrequency: ['2-3 volte/settimana', '1 volta/settimana', 'Ogni 10 giorni'][Math.floor(noise(12) * 3)],
    growthRate: parseFloat((0.8 + noise(13) * 1.5).toFixed(1)),
    subscriberHistory,
    viewsHistory,
  }
}

export async function GET(request: NextRequest) {
  try {
    let token = request.cookies.get('token')?.value
    if (!token) {
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.slice(7)
      }
    }
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    let decoded: { userId: string }
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    } catch (jwtError: any) {
      console.warn('Analytics JWT verify failed:', jwtError.message)
      const res = NextResponse.json({ error: 'Session expired. Please log in again.' }, { status: 401 })
      res.cookies.set('token', '', { maxAge: 0, path: '/' })
      return res
    }

    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')

    // Se è richiesta una piattaforma specifica, restituisci dati dettagliati
    if (platform && ['instagram', 'tiktok', 'youtube'].includes(platform)) {
      const pStats = user.social_stats?.[platform as keyof typeof user.social_stats]
      const isConnected = user.connected_platforms[platform as keyof typeof user.connected_platforms]

      if (!isConnected || !pStats) {
        return NextResponse.json({ error: 'Piattaforma non connessa' }, { status: 400 })
      }

      let detailed: any
      if (platform === 'instagram') {
        detailed = generateInstagramDetailed(pStats, user.id)
      } else if (platform === 'tiktok') {
        detailed = generateTikTokDetailed(pStats, user.id)
      } else {
        detailed = await generateYouTubeDetailed(pStats, user.id)
      }

      return NextResponse.json(detailed)
    }

    // Altrimenti restituisci i dati aggregati
    const stats = user.social_stats
    const connected = user.connected_platforms

    const totalFollowers = (connected.instagram ? (stats.instagram?.followers || 0) : 0)
      + (connected.tiktok ? (stats.tiktok?.followers || 0) : 0)
      + (connected.youtube ? (stats.youtube?.subscribers || 0) : 0)

    const totalViews = (connected.instagram ? (stats.instagram?.views || 0) : 0)
      + (connected.tiktok ? (stats.tiktok?.views || 0) : 0)
      + (connected.youtube ? (stats.youtube?.views || 0) : 0)

    const connectedCount = [connected.instagram, connected.tiktok, connected.youtube].filter(Boolean).length

    let avgEngagement = 0
    if (connectedCount > 0) {
      let totalEngagement = 0
      if (connected.instagram) totalEngagement += stats.instagram?.engagement || 0
      if (connected.tiktok) totalEngagement += stats.tiktok?.engagement || 0
      if (connected.youtube) totalEngagement += stats.youtube?.engagement || 0
      avgEngagement = totalEngagement / connectedCount
    }

    const totalVideos = (connected.instagram ? (stats.instagram?.videos || 0) : 0)
      + (connected.tiktok ? (stats.tiktok?.videos || 0) : 0)
      + (connected.youtube ? (stats.youtube?.videos || 0) : 0)

    const userIdStr = user.id ? user.id.toString() : 'default'
    const connectedPlatformsList: ('instagram' | 'tiktok' | 'youtube')[] = []
    if (connected.instagram) connectedPlatformsList.push('instagram')
    if (connected.tiktok) connectedPlatformsList.push('tiktok')
    if (connected.youtube) connectedPlatformsList.push('youtube')

    const igEng = connected.instagram ? await getPlatformEngagement(userIdStr, 'instagram', stats.instagram, false) : null
    const ttEng = connected.tiktok ? await getPlatformEngagement(userIdStr, 'tiktok', stats.tiktok, false) : null
    const ytEng = connected.youtube ? await getPlatformEngagement(userIdStr, 'youtube', stats.youtube, true) : null

    const totalLikes = (igEng?.likes || 0) + (ttEng?.likes || 0) + (ytEng?.likes || 0)
    const totalComments = (igEng?.comments || 0) + (ttEng?.comments || 0) + (ytEng?.comments || 0)
    const histories = await buildPlatformHistories(userIdStr, connectedPlatformsList, stats, 7)

    let history = await buildRealHistory(userIdStr, connectedPlatformsList, 7)

    // Se non ci sono dati reali aggregati sufficienti, fallback al pattern simulato esistente
    if (history.length === 0) {
      const days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
      history = days.map((day, i) => {
        if (connectedCount === 0) {
          return { name: day, followers: 0, views: 0 }
        }
        const baseFollowers = totalFollowers
        const baseViews = totalViews
        const noise = getDeterministicNoise(userIdStr, i)
        const followers = Math.floor(
          baseFollowers - (6 - i) * Math.max(1, Math.floor(baseFollowers * 0.0012)) + (noise - 0.5) * Math.max(1, Math.floor(baseFollowers * 0.0003))
        )
        const dailyAverageViews = baseViews / 7
        const views = Math.floor(
          dailyAverageViews * (0.8 + noise * 0.5)
        )
        return {
          name: day,
          followers: Math.max(0, followers),
          views: Math.max(0, views),
        }
      })
    }

    return NextResponse.json({
      totalFollowers,
      totalViews,
      avgEngagement: Math.round(avgEngagement * 10) / 10,
      totalVideos,
      totalLikes,
      totalComments,
      history,
      histories,
      platforms: {
        instagram: {
          connected: connected.instagram || false,
          stats: connected.instagram ? { ...(stats.instagram || { followers: 0, views: 0, engagement: 0, videos: 0 }), likes: igEng?.likes || 0, comments: igEng?.comments || 0, shares: igEng?.shares || 0 } : null,
          recentPosts: igEng?.recentPosts || [],
        },
        tiktok: {
          connected: connected.tiktok || false,
          stats: connected.tiktok ? { ...(stats.tiktok || { followers: 0, views: 0, engagement: 0, videos: 0 }), likes: ttEng?.likes || 0, comments: ttEng?.comments || 0, shares: ttEng?.shares || 0 } : null,
          recentPosts: ttEng?.recentPosts || [],
        },
        youtube: {
          connected: connected.youtube || false,
          stats: connected.youtube ? { ...(stats.youtube || { subscribers: 0, views: 0, engagement: 0, videos: 0 }), likes: ytEng?.likes || 0, comments: ytEng?.comments || 0, shares: ytEng?.shares || 0 } : null,
          recentPosts: ytEng?.recentPosts || [],
        },
      },
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
