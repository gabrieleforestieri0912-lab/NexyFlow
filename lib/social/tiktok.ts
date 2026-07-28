export interface TikTokStats {
  followers: number
  views: number
  videos: number
  engagement: number
  displayName: string
  avatar: string
}

export async function getTikTokStats(username: string): Promise<TikTokStats | null> {
  const clientKey = process.env.TIKTOK_CLIENT_KEY
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET
  if (!clientKey || !clientSecret) {
    return null
  }

  try {
    const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    })
    const tokenData: any = await tokenRes.json()
    const accessToken: string | undefined = tokenData.access_token
    if (!accessToken) return null

    const res = await fetch(
      `https://open.tiktokapis.com/v2/research/user/info/?username=${encodeURIComponent(username)}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    const data: any = await res.json()
    const user = data.data?.user
    if (!user) return null

    return {
      followers: user.follower_count,
      views: user.total_video_views || 0,
      videos: user.video_count,
      engagement: user.follower_count > 0
        ? parseFloat(((user.like_count || 0) / user.follower_count).toFixed(1))
        : 0,
      displayName: user.display_name,
      avatar: user.avatar_url,
    }
  } catch (err) {
    console.error('TikTok API error:', err)
    return null
  }
}
