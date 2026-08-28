export interface InstagramStats {
  followers: number
  views: number
  videos: number
  engagement: number
}

export interface InstagramProfile {
  id: string
  username: string
  account_type: string
  media_count: number
}

export function getInstagramAuthUrl(state: string): string {
  const appId = process.env.INSTAGRAM_APP_ID
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI
  if (!appId || !redirectUri) return ''

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    scope: 'user_profile,user_media',
    response_type: 'code',
    state,
  })

  return `https://api.instagram.com/oauth/authorize?${params.toString()}`
}

export async function exchangeCodeForToken(code: string): Promise<{ access_token: string; user_id: number } | null> {
  const appId = process.env.INSTAGRAM_APP_ID
  const appSecret = process.env.INSTAGRAM_APP_SECRET
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI

  if (!appId || !appSecret || !redirectUri) return null

  try {
    const res = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: appId,
        client_secret: appSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code,
      }),
    })

    const data = await res.json()
    if (!data.access_token) return null

    return { access_token: data.access_token, user_id: data.user_id }
  } catch (err) {
    console.error('Instagram token exchange error:', err)
    return null
  }
}

export async function getLongLivedToken(shortLivedToken: string): Promise<string | null> {
  const appSecret = process.env.INSTAGRAM_APP_SECRET
  if (!appSecret) return null

  try {
    const res = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${shortLivedToken}`
    )
    const data = await res.json()
    return data.access_token || null
  } catch (err) {
    console.error('Instagram long-lived token error:', err)
    return null
  }
}

export async function getInstagramProfile(accessToken: string): Promise<InstagramProfile | null> {
  try {
    const res = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${accessToken}`
    )
    const data = await res.json()
    if (!data.id) return null
    return data as InstagramProfile
  } catch (err) {
    console.error('Instagram profile error:', err)
    return null
  }
}

export async function getInstagramStats(accessToken?: string): Promise<InstagramStats | null> {
  if (accessToken) {
    const profile = await getInstagramProfile(accessToken)
    if (profile) {
      return {
        followers: 0,
        views: 0,
        videos: profile.media_count,
        engagement: 0,
      }
    }
  }

  const appId = process.env.INSTAGRAM_APP_ID
  const appSecret = process.env.INSTAGRAM_APP_SECRET
  if (!appId || !appSecret) return null

  return null
}

export async function getInstagramBusinessStats(instagramBusinessId: string, accessToken: string): Promise<InstagramStats | null> {
  try {
    const res = await fetch(
      `https://graph.facebook.com/v18.0/${instagramBusinessId}?fields=followers_count,media_count,profile_picture_url,username&access_token=${accessToken}`
    )
    const data: any = await res.json()
    if (!data.followers_count) return null

    const insightsRes = await fetch(
      `https://graph.facebook.com/v18.0/${instagramBusinessId}/insights?metric=impressions,reach,engagement&period=day&access_token=${accessToken}`
    )
    const insights: any = await insightsRes.json()

    const engagement = insights.data?.find((d: any) => d.name === 'engagement')?.values?.[0]?.value || 0
    const impressions = insights.data?.find((d: any) => d.name === 'impressions')?.values?.[0]?.value || 0

    return {
      followers: data.followers_count,
      views: impressions,
      videos: data.media_count,
      engagement: impressions > 0
        ? parseFloat(((engagement / impressions) * 100).toFixed(1))
        : 0,
    }
  } catch (err) {
    console.error('Instagram Graph API error:', err)
    return null
  }
}
