import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import User from '@/models/User'
import { exchangeCodeForToken, getLongLivedToken, getInstagramProfile } from '@/lib/social/instagram'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(new URL('/dashboard/connect?instagram=error', request.url))
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL('/dashboard/connect?instagram=error', request.url))
  }

  try {
    const shortToken = await exchangeCodeForToken(code)
    if (!shortToken) {
      return NextResponse.redirect(new URL('/dashboard/connect?instagram=error', request.url))
    }

    const longLived = await getLongLivedToken(shortToken.access_token)
    const accessToken = longLived || shortToken.access_token

    const profile = await getInstagramProfile(accessToken)
    if (!profile) {
      return NextResponse.redirect(new URL('/dashboard/connect?instagram=error', request.url))
    }

    const user = await User.findById(state)
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const connectedPlatforms = { ...user.connected_platforms, instagram: true }
    const socialStats = {
      ...user.social_stats,
      instagram: {
        followers: 0,
        views: 0,
        videos: profile.media_count,
        engagement: 0,
      },
    }

    await User.updateById(state, {
      connected_platforms: connectedPlatforms,
      social_stats: socialStats,
      instagram_access_token: accessToken,
    } as any)

    return NextResponse.redirect(new URL('/dashboard/connect?instagram=success', request.url))
  } catch (err) {
    console.error('Instagram OAuth callback error:', err)
    return NextResponse.redirect(new URL('/dashboard/connect?instagram=error', request.url))
  }
}
