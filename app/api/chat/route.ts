import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import User from '@/models/User'
import { checkDailyQueryLimit } from '@/lib/plan'
import { aiChat } from '@/lib/ai'
import { buildUserContext } from '@/lib/user-context'

const SYSTEM_PROMPT = `You are SocialScore AI, an expert social media analytics assistant specialized in helping creators grow their presence on Instagram, TikTok, and YouTube.

IMPORTANT: You MUST ALWAYS respond in Italian, regardless of the language of the user's message.

READ-ONLY RULES (mandatory):
- You can ONLY read the user's data provided in the USER CONTEXT below and give answers, analysis, and advice based on it.
- You MUST NOT perform, initiate, or claim to perform ANY action on the user's behalf: no publishing posts, no sending messages or DMs, no purchases or plan changes, no connecting or disconnecting accounts, no modifying any data, no making API calls, no external requests.
- If the user asks you to perform an action, clearly explain that you can only read your data and give advice, and tell them where they can do it manually in the Nexyflow app.

Your expertise includes:
- Analyzing social media profiles and content performance
- Providing recommendations for growing followers and engagement
- Understanding platform algorithms and best practices
- Creating content strategies tailored to each platform
- Identifying trends and opportunities

Always base your answers on the USER CONTEXT data. Do not invent numbers that are not present. If data is missing or a platform is not connected, say so. Always provide helpful, actionable advice specific to the user's situation. Be encouraging and supportive.`



export async function POST(request: NextRequest) {
  try {
    let token = request.cookies.get('token')?.value
    if (!token) {
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.slice(7)
      }
    }

    if (!token) {
      return NextResponse.json({ 
        error: 'Authentication required',
        response: 'Accedi al tuo account Nexyflow per iniziare a chattare con l\'IA.'
      }, { status: 401 })
    }

    let decoded: { userId: string }
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    } catch {
      return NextResponse.json({ 
        error: 'Session expired',
        response: 'La tua sessione è scaduta. Effettua nuovamente l\'accesso per continuare.'
      }, { status: 401 })
    }

    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const limitCheck = await checkDailyQueryLimit(user)
    if (!limitCheck.allowed) {
      return NextResponse.json({
        error: 'Daily limit reached',
        response: limitCheck.reason,
      }, { status: 200 })
    }

    const { message, model, history } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const messages = [
      ...(history || []).slice(-10).map((msg: any) => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: message }
    ]

    const result = await aiChat(`${SYSTEM_PROMPT}\n\n${await buildUserContext(user)}`, messages, { model })

    return NextResponse.json({ response: result.content, provider: result.provider, model: result.model })
  } catch (error: any) {
    console.error('Chat API error:', error)

    if (error.cause?.code === 'ECONNREFUSED') {
      return NextResponse.json({
        error: 'Cannot connect to the AI model',
        response: 'I cannot connect to the AI model. If you configured an API key make sure it is valid, otherwise please make sure Ollama is running in your terminal with "ollama serve".'
      }, { status: 500 })
    }

    return NextResponse.json({
      error: 'Internal server error',
      response: 'An unexpected error occurred. Please try again later.'
    }, { status: 500 })
  }
}
