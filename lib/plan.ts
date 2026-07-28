import User from '@/models/User'

export type PlanTier = 'free' | 'pro' | 'business' | 'enterprise'

export const PLAN_LIMITS = {
  free: {
    dailyQueries: 3,
    maxPlatforms: 1,
  },
  pro: {
    dailyQueries: Infinity,
    maxPlatforms: 2,
  },
  business: {
    dailyQueries: Infinity,
    maxPlatforms: 3,
  },
  enterprise: {
    dailyQueries: Infinity,
    maxPlatforms: Infinity,
  },
}

export async function checkDailyQueryLimit(user: {
  id: string
  plan: string
  daily_queries_count: number
  last_query_date: string | null
}): Promise<{ allowed: boolean; reason?: string }> {
  if (user.plan && user.plan !== 'free') {
    return { allowed: true }
  }

  const limit = PLAN_LIMITS.free.dailyQueries
  const todayStr = new Date().toISOString().split('T')[0]

  if (user.last_query_date !== todayStr) {
    await User.updateById(user.id, {
      daily_queries_count: 1,
      last_query_date: todayStr,
    })
    return { allowed: true }
  }

  if (user.daily_queries_count >= limit) {
    return {
      allowed: false,
      reason: 'Hai raggiunto il tuo limite giornaliero di 3 query IA sul piano Gratis. Fai l\'upgrade al piano Pro per avere query IA illimitate e sbloccare analisi avanzate!',
    }
  }

  await User.updateById(user.id, {
    daily_queries_count: user.daily_queries_count + 1,
  })

  return { allowed: true }
}

export async function canConnectPlatform(user: {
  id: string
  plan: string
  connected_platforms: { [key: string]: boolean | undefined }
}): Promise<{ allowed: boolean; reason?: string }> {
  const plan = (user.plan || 'free') as PlanTier
  const maxPlatforms = PLAN_LIMITS[plan]?.maxPlatforms ?? PLAN_LIMITS.free.maxPlatforms

  const connectedCount = Object.values(user.connected_platforms || {}).filter(Boolean).length

  if (connectedCount >= maxPlatforms) {
    const planName = plan === 'free' ? 'Gratis' : plan === 'pro' ? 'Pro' : plan === 'business' ? 'Business' : 'Enterprise'
    return {
      allowed: false,
      reason: `Il piano ${planName} ti consente di collegare al massimo ${maxPlatforms === Infinity ? 'un numero illimitato di' : maxPlatforms} piattaforma${maxPlatforms !== 1 ? 'e' : ''}. ${plan === 'free' ? 'Fai l\'upgrade per collegare più piattaforme.' : ''}`,
    }
  }

  return { allowed: true }
}
