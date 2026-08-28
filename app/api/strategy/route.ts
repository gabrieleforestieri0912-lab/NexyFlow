import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import User from '@/models/User'
import { checkDailyQueryLimit } from '@/lib/plan'
import { aiChatJson } from '@/lib/ai'
import { buildUserContext } from '@/lib/user-context'

function generateFallbackStrategy(user: any) {
  const stats = user.social_stats
  const connected = user.connected_platforms

  let mainPlatform = 'Instagram'
  let maxFollowers = stats?.instagram?.followers || 0

  if (connected.tiktok && (stats?.tiktok?.followers || 0) > maxFollowers) {
    mainPlatform = 'TikTok'
    maxFollowers = stats.tiktok.followers
  }
  if (connected.youtube && (stats?.youtube?.subscribers || 0) > maxFollowers) {
    mainPlatform = 'YouTube'
    maxFollowers = stats.youtube.subscribers
  }

  return {
    competitors: [
      { name: 'Competitor1', platform: mainPlatform, followers: Math.floor(maxFollowers * 1.5).toLocaleString(), engagement: '4.5%' },
      { name: 'Competitor2', platform: mainPlatform, followers: Math.floor(maxFollowers * 0.8).toLocaleString(), engagement: '5.2%' },
      { name: 'Competitor3', platform: mainPlatform === 'Instagram' ? 'TikTok' : 'Instagram', followers: Math.floor(maxFollowers * 1.2).toLocaleString(), engagement: '6.1%' },
    ],
    insights: {
      growthSpeed: maxFollowers > 10000 ? 'Veloce' : 'Moderata',
      topFormat: mainPlatform === 'YouTube' ? 'Video Lunghi' : 'Video Brevi (Reels/Shorts)',
      engagementRate: '4.2%',
      recommendation: `Concentrati su ${mainPlatform} per aumentare la tua reach e pubblica almeno 4 volte a settimana.`,
    },
    contentPlan: [
      { week: 'Settimana 1', focus: 'Analisi e Testing Formati', tasks: ['Pubblica 3 formati diversi', 'Analizza i risultati', 'Interagisci con la community'] },
      { week: 'Settimana 2', focus: 'Scalare i contenuti migliori', tasks: ['Crea 2 video simili al migliore', 'Usa hashtag di nicchia', 'Rispondi a tutti i commenti'] },
      { week: 'Settimana 3', focus: 'Collaborazioni e Cross-posting', tasks: ['Contatta 2 creator simili', 'Condividi contenuti su altre piattaforme', 'Live stream'] },
      { week: 'Settimana 4', focus: 'Fidelizzazione', tasks: ['Q&A con i follower', 'Dietro le quinte', 'Sondaggi per prossimi contenuti'] },
    ]
  }
}

export async function GET(request: NextRequest) {
  try {
    let token = request.cookies.get('token')?.value
    if (!token) {
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) token = authHeader.slice(7)
    }
    if (!token) {
      return NextResponse.json({ error: 'Autenticazione richiesta' }, { status: 401 })
    }

    let decoded: { userId: string }
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    } catch {
      return NextResponse.json({ error: 'Sessione scaduta' }, { status: 401 })
    }

    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 })
    }

    const limit = await checkDailyQueryLimit(user)
    if (!limit.allowed) {
      return NextResponse.json({
        error: 'Daily limit reached',
        message: limit.reason,
      }, { status: 200 })
    }

    const context = await buildUserContext(user)

    const systemPrompt = `Sei un consulente AI per social media. 
Ecco i dati completi dell'utente (read-only):

${context}

Analizza queste statistiche — incluso like, commenti e i contenuti top di ogni piattaforma — e genera una strategia personalizzata che sfrutti i contenuti che stanno performando meglio.
Rispondi ESCLUSIVAMENTE in JSON valido in questa struttura esatta:
{
  "competitors": [{"name": "Nome1", "platform": "Instagram", "followers": "100K", "engagement": "5%"}... 3 elementi],
  "insights": {
    "growthSpeed": "Lenta/Moderata/Veloce",
    "topFormat": "Il formato ideale",
    "engagementRate": "Stima %",
    "recommendation": "Frase di raccomandazione"
  },
  "contentPlan": [
    {"week": "Settimana 1", "focus": "Obiettivo", "tasks": ["Task 1", "Task 2", "Task 3"]} ... 4 settimane
  ]
}`

    let strategyData = null
    try {
      const result = await aiChatJson(systemPrompt, [{ role: 'user', content: 'Genera una strategia personalizzata basata sui miei dati.' }])
      const content = result.content
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        strategyData = JSON.parse(jsonMatch[0])
      }
    } catch {
      // AI not available, use fallback
    }

    if (!strategyData) {
      strategyData = generateFallbackStrategy(user)
    }

    return NextResponse.json(strategyData)
  } catch (error) {
    console.error('Strategy API error:', error)
    return NextResponse.json({ error: 'Errore durante la generazione della strategia' }, { status: 500 })
  }
}
