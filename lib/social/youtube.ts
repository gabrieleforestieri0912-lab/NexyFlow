export interface YouTubeStats {
  subscribers: number
  views: number
  videos: number
  engagement: number
  channelId: string
  title: string
  thumbnail: string
}

export interface YouTubeVideo {
  id: string
  title: string
  publishedAt: string
  thumbnail: string
  views: number
  likes: number
  comments: number
  durationSeconds: number
}

export interface YouTubeChannelDetails {
  channelId: string
  title: string
  description: string
  thumbnail: string
  subscribers: number
  views: number
  videos: number
  engagement: number
  country?: string
  publishedAt: string
}

export interface YouTubeSyncData {
  channel: YouTubeChannelDetails
  videos: YouTubeVideo[]
}

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

function getApiKey(): string | null {
  const key = process.env.YOUTUBE_API_KEY
  if (!key || key === 'AIzaSyDummyKeyReplaceWithRealKey') return null
  return key
}

function calculateYouTubeEngagement(stats: { viewCount?: string; subscriberCount?: string }): number {
  const views = parseInt(stats.viewCount || '0') || 0
  const subs = parseInt(stats.subscriberCount || '0') || 0
  if (views === 0 || subs === 0) return 0
  const ratio = views / subs
  return parseFloat(Math.min(ratio * 0.5, 15).toFixed(1))
}

function parseDuration(isoDuration: string): number {
  const match = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(isoDuration)
  if (!match) return 0
  const hours = parseInt(match[1] || '0') || 0
  const minutes = parseInt(match[2] || '0') || 0
  const seconds = parseInt(match[3] || '0') || 0
  return hours * 3600 + minutes * 60 + seconds
}

export class YouTubeAPIError extends Error {
  constructor(
    message: string,
    public readonly code: 'QUOTA_EXCEEDED' | 'CHANNEL_NOT_FOUND' | 'API_ERROR' | 'NOT_CONFIGURED' = 'API_ERROR'
  ) {
    super(message)
    this.name = 'YouTubeAPIError'
  }
}

export async function getYouTubeStats(channelHandle: string): Promise<YouTubeStats | null> {
  const details = await getYouTubeChannelDetails(channelHandle)
  if (!details) return null
  return {
    subscribers: details.subscribers,
    views: details.views,
    videos: details.videos,
    engagement: details.engagement,
    channelId: details.channelId,
    title: details.title,
    thumbnail: details.thumbnail,
  }
}

export async function getYouTubeChannelDetails(channelHandle: string): Promise<YouTubeChannelDetails | null> {
  return getYouTubeChannelDetailsByHandle(channelHandle)
}

export async function getYouTubeChannelDetailsByHandle(channelHandle: string): Promise<YouTubeChannelDetails | null> {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new YouTubeAPIError('YouTube API key non configurata', 'NOT_CONFIGURED')
  }

  try {
    const searchRes = await fetch(
      `${YOUTUBE_API_BASE}/search?part=snippet&q=${encodeURIComponent(channelHandle)}&type=channel&key=${apiKey}`
    )
    const searchData: any = await searchRes.json()
    const channelId: string | undefined = searchData.items?.[0]?.id?.channelId
    if (!channelId) {
      throw new YouTubeAPIError(`Canale YouTube non trovato per "${channelHandle}"`, 'CHANNEL_NOT_FOUND')
    }

    return getYouTubeChannelDetailsById(channelId)
  } catch (err) {
    if (err instanceof YouTubeAPIError) throw err
    console.error('YouTube API error:', err)
    throw new YouTubeAPIError('Errore durante il recupero dei dati YouTube', 'API_ERROR')
  }
}

export async function getYouTubeChannelDetailsById(channelId: string): Promise<YouTubeChannelDetails | null> {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new YouTubeAPIError('YouTube API key non configurata', 'NOT_CONFIGURED')
  }

  try {
    const statsRes = await fetch(
      `${YOUTUBE_API_BASE}/channels?part=statistics,snippet&id=${channelId}&key=${apiKey}`
    )
    const statsData: any = await statsRes.json()
    const channel = statsData.items?.[0]
    if (!channel) {
      throw new YouTubeAPIError(`Canale YouTube non trovato per l'ID "${channelId}"`, 'CHANNEL_NOT_FOUND')
    }

    const statistics = channel.statistics || {}
    const snippet = channel.snippet || {}

    return {
      channelId,
      title: snippet.title,
      description: snippet.description || '',
      thumbnail: snippet.thumbnails?.default?.url || snippet.thumbnails?.high?.url || '',
      subscribers: parseInt(statistics.subscriberCount) || 0,
      views: parseInt(statistics.viewCount) || 0,
      videos: parseInt(statistics.videoCount) || 0,
      engagement: calculateYouTubeEngagement(statistics),
      country: snippet.country,
      publishedAt: snippet.publishedAt,
    }
  } catch (err) {
    if (err instanceof YouTubeAPIError) throw err
    console.error('YouTube API error:', err)
    throw new YouTubeAPIError('Errore durante il recupero dei dati YouTube', 'API_ERROR')
  }
}

export async function getYouTubeLatestVideos(channelId: string, maxResults = 10): Promise<YouTubeVideo[]> {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new YouTubeAPIError('YouTube API key non configurata', 'NOT_CONFIGURED')
  }

  try {
    const channelRes = await fetch(
      `${YOUTUBE_API_BASE}/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    )
    const channelData: any = await channelRes.json()
    const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
    if (!uploadsPlaylistId) return []

    const playlistRes = await fetch(
      `${YOUTUBE_API_BASE}/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${apiKey}`
    )
    const playlistData: any = await playlistRes.json()
    const items = playlistData.items || []
    if (items.length === 0) return []

    const videoIds = items.map((item: any) => item.contentDetails.videoId).join(',')
    const statsRes = await fetch(
      `${YOUTUBE_API_BASE}/videos?part=statistics,contentDetails,snippet&id=${videoIds}&key=${apiKey}`
    )
    const statsData: any = await statsRes.json()
    const videoMap = new Map<string, any>(statsData.items?.map((v: any) => [v.id, v]))

    return items.map((item: any) => {
      const videoId = item.contentDetails.videoId
      const video = videoMap.get(videoId) || {}
      const snippet = video.snippet || item.snippet || {}
      const statistics = video.statistics || {}
      const contentDetails = video.contentDetails || {}

      return {
        id: videoId,
        title: snippet.title || 'Untitled',
        publishedAt: snippet.publishedAt || item.snippet?.publishedAt,
        thumbnail: snippet.thumbnails?.default?.url || '',
        views: parseInt(statistics.viewCount) || 0,
        likes: parseInt(statistics.likeCount) || 0,
        comments: parseInt(statistics.commentCount) || 0,
        durationSeconds: parseDuration(contentDetails.duration),
      }
    })
  } catch (err) {
    if (err instanceof YouTubeAPIError) throw err
    console.error('YouTube latest videos error:', err)
    throw new YouTubeAPIError('Errore durante il recupero dei video recenti', 'API_ERROR')
  }
}

export async function syncYouTubeData(channelHandle: string): Promise<YouTubeSyncData> {
  const channel = await getYouTubeChannelDetails(channelHandle)
  const videos = await getYouTubeLatestVideos(channel.channelId)
  return { channel, videos }
}

export { calculateYouTubeEngagement }
