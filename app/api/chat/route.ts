import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import User from '@/models/User'
import { checkDailyQueryLimit } from '@/lib/plan'

const OLLAMA_URL = 'http://localhost:11434/api/chat'

const SYSTEM_PROMPT = `You are SocialScore AI, an expert social media analytics assistant specialized in helping creators grow their presence on Instagram, TikTok, and YouTube.

IMPORTANT: You MUST ALWAYS respond in Italian, regardless of the language of the user's message.

Your expertise includes:
- Analyzing social media profiles and content performance
- Providing recommendations for growing followers and engagement
- Understanding platform algorithms and best practices
- Creating content strategies tailored to each platform
- Identifying trends and opportunities

Always provide helpful, actionable advice specific to the user's situation. Be encouraging and supportive.`

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
        response: 'Accedi al tuo account NextBrand per iniziare a chattare con l\'IA.'
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

    const ollamaModel = model || 'llama3'

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(history || []).slice(-10).map((msg: any) => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: message }
    ]

    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: ollamaModel,
        messages: messages,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Ollama API error:', response.status, errorText)
      return NextResponse.json({
        error: 'Ollama is not running. Make sure you started it with "ollama serve"',
        response: 'I apologize, but Ollama is not running. Please start it in your terminal with "ollama serve" and make sure you have downloaded the model with "ollama pull llama3".'
      }, { status: 500 })
    }

    const data: any = await response.json()
    const aiResponse = data.message?.content || 'I apologize, but I could not generate a response. Please try again.'

    return NextResponse.json({ response: aiResponse })
  } catch (error: any) {
    console.error('Chat API error:', error)

    if (error.cause?.code === 'ECONNREFUSED') {
      return NextResponse.json({
        error: 'Cannot connect to Ollama',
        response: 'I cannot connect to Ollama. Please make sure Ollama is running in your terminal with "ollama serve".'
      }, { status: 500 })
    }

    return NextResponse.json({
      error: 'Internal server error',
      response: 'An unexpected error occurred. Please try again later.'
    }, { status: 500 })
  }
}
