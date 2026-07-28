import supabase from '@/lib/supabase'

export interface SocialMetric {
  id: string
  user_id: string
  platform: 'instagram' | 'tiktok' | 'youtube'
  metric_date: string
  followers: number
  views: number
  engagement: number
  videos: number
  subscribers: number
  extra: Record<string, any>
  created_at: string
  updated_at: string
}

export interface MetricInput {
  followers?: number
  views?: number
  engagement?: number
  videos?: number
  subscribers?: number
  extra?: Record<string, any>
}

function toMetricDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

const SocialMetrics = {
  async getRecent(userId: string, platform: SocialMetric['platform'], days = 7): Promise<SocialMetric[]> {
    const since = new Date()
    since.setDate(since.getDate() - days)
    const { data, error } = await supabase
      .from('social_metrics')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', platform)
      .gte('metric_date', since.toISOString().split('T')[0])
      .order('metric_date', { ascending: true })
    if (error) {
      console.error('SocialMetrics.getRecent error:', error)
      return []
    }
    return (data || []).map(row => ({ ...row, extra: row.extra || {} })) as SocialMetric[]
  },

  async getHistory(userId: string, platform: SocialMetric['platform'], days = 7): Promise<SocialMetric[]> {
    return this.getRecent(userId, platform, days)
  },

  async upsertMetric(
    userId: string,
    platform: SocialMetric['platform'],
    date: Date | string,
    input: MetricInput
  ): Promise<SocialMetric | null> {
    const metricDate = typeof date === 'string' ? date : toMetricDate(date)
    const payload = {
      user_id: userId,
      platform,
      metric_date: metricDate,
      followers: input.followers ?? 0,
      views: input.views ?? 0,
      engagement: input.engagement ?? 0,
      videos: input.videos ?? 0,
      subscribers: input.subscribers ?? 0,
      extra: input.extra ?? {},
    }
    const { data, error } = await supabase
      .from('social_metrics')
      .upsert(payload, { onConflict: 'user_id,platform,metric_date' })
      .select()
      .single()
    if (error) {
      console.error('SocialMetrics.upsertMetric error:', error)
      return null
    }
    return data ? ({ ...data, extra: data.extra || {} } as SocialMetric) : null
  },
}

export default SocialMetrics
