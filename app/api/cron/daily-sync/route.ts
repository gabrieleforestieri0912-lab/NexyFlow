import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/lib/supabase'
import User from '@/models/User'
import SocialMetrics from '@/models/SocialMetrics'
import SocialPost from '@/models/SocialPost'
import { syncYouTubeData } from '@/lib/social/youtube'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.YOUTUBE_API_KEY) {
    return NextResponse.json({ error: 'YouTube API not configured' }, { status: 503 })
  }

  const { data: users, error } = await supabase
    .from('users')
    .select('id, social_stats')
    .eq('connected_platforms->>youtube', 'true')

  if (error) {
    console.error('Daily sync users query error:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }

  let synced = 0
  let failed = 0

  for (const row of users || []) {
    const handle = (row.social_stats as any)?.youtube?.handle
    if (!handle) {
      failed++
      continue
    }

    try {
      const data = await syncYouTubeData(handle)
      if (!data) {
        failed++
        continue
      }

      const { channel, videos } = data
      const today = new Date()

      await SocialMetrics.upsertMetric(row.id as string, 'youtube', today, {
        followers: 0,
        subscribers: channel.subscribers,
        views: channel.views,
        engagement: channel.engagement,
        videos: channel.videos,
        extra: {
          title: channel.title,
          thumbnail: channel.thumbnail,
          channelId: channel.channelId,
        },
      })

      if (videos.length > 0) {
        const postInputs = videos.map(video => ({
          post_id: video.id,
          title: video.title,
          published_at: video.publishedAt,
          views: video.views,
          likes: video.likes,
          comments: video.comments,
          shares: 0,
          thumbnail: video.thumbnail,
          extra: {
            durationSeconds: video.durationSeconds,
          },
        }))
        await SocialPost.upsertMany(row.id as string, 'youtube', postInputs)
      }

      const currentStats = (row.social_stats as any)?.youtube || {}
      await User.updateById(row.id as string, {
        social_stats: {
          ...(row.social_stats || {}),
          youtube: {
            ...currentStats,
            subscribers: channel.subscribers,
            views: channel.views,
            videos: channel.videos,
            engagement: channel.engagement,
            title: channel.title,
            thumbnail: channel.thumbnail,
            channelId: channel.channelId,
            lastSyncedAt: today.toISOString(),
          },
        },
      } as any)

      synced++
    } catch (err: any) {
      console.error(`Daily sync failed for user ${row.id}:`, err.message || err)
      failed++
    }
  }

  return NextResponse.json({ synced, failed, total: (users || []).length })
}
