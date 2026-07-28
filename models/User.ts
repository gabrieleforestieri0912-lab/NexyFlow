import supabase from '@/lib/supabase'

export interface SocialPlatformStats {
  followers: number
  views: number
  engagement: number
  videos: number
  subscribers?: number
}

export interface InstagramDetailed {
  followers: number
  following: number
  posts: number
  engagement: number
  avgLikes: number
  avgComments: number
  storyCompletionRate: number
  reach: number
  impressions: number
  profileVisits: number
  contentMix: { photos: number; videos: number; carousels: number }
  topPosts: { id: string; type: string; likes: number; comments: number; date: string }[]
  bestPostingTime: string
  growthRate: number
  followerHistory: { name: string; value: number }[]
  engagementHistory: { name: string; value: number }[]
}

export interface TikTokDetailed {
  followers: number
  following: number
  likes: number
  videos: number
  engagement: number
  avgWatchTime: number
  completionRate: number
  shareRate: number
  commentRate: number
  profileViews: number
  trendingVideos: { id: string; plays: number; likes: number; shares: number; comments: number; date: string }[]
  topHashtags: { tag: string; count: number }[]
  bestPostingTime: string
  growthRate: number
  followerHistory: { name: string; value: number }[]
  engagementHistory: { name: string; value: number }[]
}

export interface YouTubeDetailed {
  subscribers: number
  views: number
  videos: number
  engagement: number
  avgViewDuration: number
  watchTime: number
  likes: number
  comments: number
  impressions: number
  clickThroughRate: number
  trafficSources: { source: string; percentage: number }[]
  topVideos: { id: string; title: string; views: number; likes: number; comments: number; date: string }[]
  uploadFrequency: string
  growthRate: number
  subscriberHistory: { name: string; value: number }[]
  viewsHistory: { name: string; value: number }[]
}

export interface ConnectedPlatforms {
  instagram: boolean
  tiktok: boolean
  youtube: boolean
}

export interface SocialStats {
  instagram: SocialPlatformStats
  tiktok: SocialPlatformStats
  youtube: SocialPlatformStats & {
    subscribers: number
    handle?: string
    channelId?: string
    title?: string
    thumbnail?: string
    lastSyncedAt?: string
  }
}

export interface UserData {
  id: string
  name: string
  email: string
  password?: string | null
  avatar: string
  plan: 'free' | 'pro' | 'business' | 'enterprise'
  daily_queries_count: number
  last_query_date: string
  connected_platforms: ConnectedPlatforms
  social_stats: SocialStats
  language: 'it' | 'en' | 'es' | 'fr'
  created_at: string
  updated_at: string
  instagram_access_token?: string
}

function rowToUser(row: any): UserData {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    avatar: row.avatar || '',
    plan: row.plan || 'free',
    daily_queries_count: row.daily_queries_count ?? 0,
    last_query_date: row.last_query_date || '',
    connected_platforms: row.connected_platforms || { instagram: false, tiktok: false, youtube: false },
    social_stats: row.social_stats || {
      instagram: { followers: 0, views: 0, engagement: 0, videos: 0 },
      tiktok: { followers: 0, views: 0, engagement: 0, videos: 0 },
      youtube: { subscribers: 0, views: 0, engagement: 0, videos: 0 },
    },
    language: row.language || 'it',
    created_at: row.created_at,
    updated_at: row.updated_at,
    instagram_access_token: row.instagram_access_token,
  }
}

const User = {
  async findById(id: string): Promise<UserData | null> {
    const { data } = await supabase.from('users').select('*').eq('id', id).single()
    return data ? rowToUser(data) : null
  },

  async findOne(query: { email?: string }): Promise<UserData | null> {
    if (query.email) {
      const { data } = await supabase.from('users').select('*').eq('email', query.email.toLowerCase()).single()
      return data ? rowToUser(data) : null
    }
    return null
  },

  async create(data: Partial<UserData>): Promise<UserData | null> {
    const { data: inserted, error } = await supabase
      .from('users')
      .insert({
        name: data.name,
        email: data.email?.toLowerCase(),
        password: data.password || null,
        avatar: data.avatar || '',
        plan: data.plan || 'free',
        connected_platforms: data.connected_platforms || { instagram: false, tiktok: false, youtube: false },
        language: data.language || 'it',
      })
      .select()
      .single()
    if (error) {
      console.error('User create error:', error)
      return null
    }
    return inserted ? rowToUser(inserted) : null
  },

  async updateById(id: string, updates: Partial<UserData>): Promise<UserData | null> {
    const { data } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return data ? rowToUser(data) : null
  },
}

export default User
