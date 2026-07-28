import supabase from '@/lib/supabase'

export interface SocialPost {
  id: string
  user_id: string
  platform: 'instagram' | 'tiktok' | 'youtube'
  post_id: string
  title: string
  published_at: string
  views: number
  likes: number
  comments: number
  shares: number
  thumbnail: string
  extra: Record<string, any>
  created_at: string
  updated_at: string
}

export interface PostInput {
  post_id: string
  title: string
  published_at?: string
  views?: number
  likes?: number
  comments?: number
  shares?: number
  thumbnail?: string
  extra?: Record<string, any>
}

const SocialPost = {
  async getRecent(
    userId: string,
    platform: SocialPost['platform'],
    limit = 10
  ): Promise<SocialPost[]> {
    const { data, error } = await supabase
      .from('social_posts')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', platform)
      .order('published_at', { ascending: false })
      .limit(limit)
    if (error) {
      console.error('SocialPost.getRecent error:', error)
      return []
    }
    return (data || []).map(row => ({ ...row, extra: row.extra || {} })) as SocialPost[]
  },

  async getTopByViews(
    userId: string,
    platform: SocialPost['platform'],
    limit = 10
  ): Promise<SocialPost[]> {
    const { data, error } = await supabase
      .from('social_posts')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', platform)
      .order('views', { ascending: false })
      .limit(limit)
    if (error) {
      console.error('SocialPost.getTopByViews error:', error)
      return []
    }
    return (data || []).map(row => ({ ...row, extra: row.extra || {} })) as SocialPost[]
  },

  async upsertPost(
    userId: string,
    platform: SocialPost['platform'],
    input: PostInput
  ): Promise<SocialPost | null> {
    const payload = {
      user_id: userId,
      platform,
      post_id: input.post_id,
      title: input.title,
      published_at: input.published_at,
      views: input.views ?? 0,
      likes: input.likes ?? 0,
      comments: input.comments ?? 0,
      shares: input.shares ?? 0,
      thumbnail: input.thumbnail ?? '',
      extra: input.extra ?? {},
    }
    const { data, error } = await supabase
      .from('social_posts')
      .upsert(payload, { onConflict: 'user_id,platform,post_id' })
      .select()
      .single()
    if (error) {
      console.error('SocialPost.upsertPost error:', error)
      return null
    }
    return data ? ({ ...data, extra: data.extra || {} } as SocialPost) : null
  },

  async upsertMany(
    userId: string,
    platform: SocialPost['platform'],
    inputs: PostInput[]
  ): Promise<number> {
    if (inputs.length === 0) return 0
    const payload = inputs.map(input => ({
      user_id: userId,
      platform,
      post_id: input.post_id,
      title: input.title,
      published_at: input.published_at,
      views: input.views ?? 0,
      likes: input.likes ?? 0,
      comments: input.comments ?? 0,
      shares: input.shares ?? 0,
      thumbnail: input.thumbnail ?? '',
      extra: input.extra ?? {},
    }))
    const { error } = await supabase
      .from('social_posts')
      .upsert(payload, { onConflict: 'user_id,platform,post_id' })
    if (error) {
      console.error('SocialPost.upsertMany error:', error)
      return 0
    }
    return inputs.length
  },
}

export default SocialPost
