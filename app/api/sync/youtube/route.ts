import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import User from '@/models/User'
import SocialMetrics from '@/models/SocialMetrics'
import SocialPost from '@/models/SocialPost'
import { syncYouTubeData, YouTubeAPIError } from '@/lib/social/youtube'

export async function POST(request: NextRequest) {
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json().catch(() => ({}))
    const handle = body?.handle || user.social_stats?.youtube?.handle
    if (!handle) {
      return NextResponse.json({ error: 'YouTube handle non fornito' }, { status: 400 })
    }

    if (!user.connected_platforms?.youtube) {
      return NextResponse.json({ error: 'YouTube non collegato' }, { status: 400 })
    }

    const data = await syncYouTubeData(handle)
    if (!data) {
      return NextResponse.json({ error: 'Errore durante il recupero dati YouTube' }, { status: 500 })
    }

    const { channel, videos } = data
    const today = new Date()

    await SocialMetrics.upsertMetric(user.id, 'youtube', today, {
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
      await SocialPost.upsertMany(user.id, 'youtube', postInputs)
    }

    const updatedStats = {
      ...user.social_stats.youtube,
      subscribers: channel.subscribers,
      views: channel.views,
      videos: channel.videos,
      engagement: channel.engagement,
      title: channel.title,
      thumbnail: channel.thumbnail,
      channelId: channel.channelId,
      handle,
      lastSyncedAt: today.toISOString(),
    }

    await User.updateById(user.id, {
      social_stats: {
        ...user.social_stats,
        youtube: updatedStats,
      } as any,
    })

    return NextResponse.json({
      channel,
      videosSynced: videos.length,
      lastSyncedAt: today.toISOString(),
    })
  } catch (error: any) {
    console.error('YouTube sync error:', error)
    if (error instanceof YouTubeAPIError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to sync YouTube data' }, { status: 500 })
  }
}
