import supabase from '@/lib/supabase'

export interface NotificationData {
  id: string
  user_id: string
  text: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  created_at: string
}

const Notification = {
  async find(query: { userId: string }): Promise<NotificationData[]> {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', query.userId)
      .order('created_at', { ascending: false })
      .limit(10)
    return (data || []) as NotificationData[]
  },

  async create(data: { userId: string; text: string; type?: string }): Promise<NotificationData | null> {
    const { data: inserted } = await supabase
      .from('notifications')
      .insert({
        user_id: data.userId,
        text: data.text,
        type: data.type || 'info',
      })
      .select()
      .single()
    return inserted as NotificationData | null
  },

  async updateMany(query: { userId: string; read: boolean }, update: { read: boolean }): Promise<void> {
    await supabase
      .from('notifications')
      .update(update)
      .eq('user_id', query.userId)
      .eq('read', query.read)
      .select()
  },
}

export default Notification
