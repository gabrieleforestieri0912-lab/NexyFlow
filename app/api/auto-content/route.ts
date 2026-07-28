import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import User from '@/models/User'
import { checkDailyQueryLimit } from '@/lib/plan'

const OLLAMA_URL = 'http://localhost:11434/api/chat'

function generateContentPlan(user: any) {
  const stats = user.social_stats
  const connected = user.connected_platforms
  const connectedPlatforms = ['instagram', 'tiktok', 'youtube'].filter(p => connected[p])

  if (connectedPlatforms.length === 0) {
    return generateFallbackContent([])
  }

  return generateFallbackContent(connectedPlatforms)
}

function generateFallbackContent(platforms: string[]) {
  const days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica']

  const contentIdeas: Record<string, string[]> = {
    instagram: [
      'Carosello informativo sul settore',
      'Reel dietro le quinte',
      'Foto prodotto con storytelling',
      'Tutorial rapido in Reel',
      'Citazione ispirazionale + grafica',
      'Video testimonianza cliente',
      'Contenuto generato dagli utenti',
    ],
    tiktok: [
      'Trend dance/audio del momento',
      'Consiglio rapido in 15 secondi',
      'POV del settore',
      'Duetto con creator affine',
      'Challenge del giorno',
      'Video educativo veloce',
      'Storytime coinvolgente',
    ],
    youtube: [
      'Video tutorial approfondito',
      'Recensione prodotto/servizio',
      'Q&A con la community',
      'Vlog del processo creativo',
      'Video educational',
      'Case study / risultati',
      'Anteprima esclusiva',
    ],
  }

  const captionTemplates = [
    'Ecco qualcosa che ho preparato per voi! 🎯 Raccontatemi cosa ne pensate nei commenti! 👇',
    'Avete mai provato questo? 🤔 Condividete la vostra esperienza qui sotto! 💬',
    'Nuovo contenuto freschissimo! 🔥 Salva e condividi con chi ne ha bisogno! 💾',
    'Lo sapevate? 🧠 Ecco un consiglio che può fare la differenza! ⚡',
    'Ogni giorno imparo qualcosa di nuovo e voglio condividerlo con voi! 🚀',
    'Il momento perfetto per provare qualcosa di nuovo! ✨ Cosa ne pensate?',
    'Ecco il contenuto che mi avete chiesto! 📢 Spero vi sia utile! 🙌',
  ]

  const hashtagSets: Record<string, string[]> = {
    instagram: ['#instagram', '#reels', '#viral', '#trending', '#contentcreator', '#marketing', '#digital', '#branding', '#crescita', '#imprenditoria'],
    tiktok: ['#fyp', '#foryou', '#viral', '#tiktok', '#trend', '#contentcreator', '#imparacontiktok', '#marketing', '#crescita', '#consigli'],
    youtube: ['#youtube', '#video', '#tutorial', '#contentcreator', '#subscriber', '#youtuber', '#marketing', '#branding', '#crescita', '#imparare'],
  }

  const schedule = days.map((day, dayIndex) => {
    const posts = platforms.map((platform, pIndex) => {
      const ideaIndex = (dayIndex * 3 + pIndex * 7) % 7
      const timeSlots: Record<string, string> = {
        instagram: ['12:00', '15:00', '18:00', '20:00', '14:00', '17:00', '19:00'][dayIndex],
        tiktok: ['09:00', '12:00', '15:00', '18:00', '21:00', '10:00', '14:00'][dayIndex],
        youtube: ['10:00', '14:00', '16:00', '09:00', '11:00', '15:00', '13:00'][dayIndex],
      }
      const types: Record<string, string> = {
        instagram: ['Carosello', 'Reel', 'Foto', 'Reel', 'Storia', 'Video', 'Carosello'][ideaIndex],
        tiktok: ['Video', 'Duetto', 'Video', 'Trend', 'Challenge', 'Tutorial', 'Storytime'][ideaIndex],
        youtube: ['Tutorial', 'Recensione', 'Q&A', 'Vlog', 'Educational', 'Case Study', 'Anteprima'][ideaIndex],
      }

      return {
        id: `${platform}_${dayIndex}_${pIndex}`,
        platform,
        type: types[platform],
        title: contentIdeas[platform]?.[ideaIndex] || 'Contenuto generato',
        caption: captionTemplates[dayIndex % captionTemplates.length],
        hashtags: hashtagSets[platform]?.slice(0, 5 + (dayIndex % 3)).join(' ') || '',
        scheduledTime: timeSlots[platform],
        status: 'draft',
      }
    })

    return { day, posts }
  })

  return {
    weekStart: 'Lunedì',
    schedule,
    summary: {
      totalPosts: platforms.length * 7,
      platforms: platforms.map(p => ({
        name: p,
        postsCount: 7,
        bestTime: p === 'instagram' ? '18:00-20:00' : p === 'tiktok' ? '19:00-22:00' : '10:00-14:00',
      })),
    },
  }
}

export async function POST(request: NextRequest) {
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
        error: 'Hai raggiunto il limite giornaliero di query. Passa al piano Pro per query illimitate.',
        limitReached: true,
      }, { status: 200 })
    }

    const body = await request.json().catch(() => ({}))
    const { regenerate, platform } = body

    const connectedPlatforms = ['instagram', 'tiktok', 'youtube'].filter(p => user.connected_platforms[p])

    let contentPlan = null
    const stats = user.social_stats

    if (connectedPlatforms.length > 0 && !regenerate) {
      try {
        const systemPrompt = `Sei un social media manager AI. 
Piattaforme connesse: ${JSON.stringify(connectedPlatforms)}
Statistiche: ${JSON.stringify(stats)}
Genera un calendario editoriale di 7 giorni per tutte le piattaforme connesse.
Rispondi ESCLUSIVAMENTE in JSON valido con questa struttura:
{
  "schedule": [
    {
      "day": "Lunedì",
      "posts": [
        {
          "platform": "instagram/tiktok/youtube",
          "type": "Reel/Carosello/Video/Tutorial",
          "title": "Titolo del contenuto",
          "caption": "Caption coinvolgente in italiano con emoji",
          "hashtags": "hashtag1 hashtag2 hashtag3",
          "scheduledTime": "18:00",
          "status": "draft"
        }
      ]
    }
  ],
  "summary": {
    "totalPosts": 14,
    "platforms": [
      {"name": "instagram", "postsCount": 7, "bestTime": "18:00-20:00"}
    ]
  }
}`

        const ollamaRes = await fetch(OLLAMA_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'llama3',
            messages: [{ role: 'system', content: systemPrompt }],
            stream: false,
          }),
        })

        if (ollamaRes.ok) {
          const data: any = await ollamaRes.json()
          const content = data.message?.content || ''
          const jsonMatch = content.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            contentPlan = JSON.parse(jsonMatch[0])
          }
        }
      } catch {
        // Ollama not available, use fallback
      }
    }

    if (!contentPlan) {
      contentPlan = generateFallbackContent(connectedPlatforms)
    }

    const response = {
      ...contentPlan,
      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Auto-content API error:', error)
    return NextResponse.json({ error: 'Errore durante la generazione del piano editoriale' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return POST(request)
}
