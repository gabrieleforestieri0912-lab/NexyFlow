import { NextRequest, NextResponse } from 'next/server'

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
    const { message, history } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(history || []).slice(-10).map((msg: any) => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: message }
    ]

    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        messages,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Ollama API error:', response.status, errorText)
      return NextResponse.json({
        error: 'Ollama is not running',
        response: 'Il server AI non è al momento disponibile. Riprova più tardi.'
      }, { status: 200 })
    }

    const data: any = await response.json()
    const aiResponse = data.message?.content || 'Spiacenti, non ho potuto generare una risposta. Riprova.'

    return NextResponse.json({ response: aiResponse })
  } catch (error: any) {
    console.error('Chat demo API error:', error)

    if (error.cause?.code === 'ECONNREFUSED') {
      return NextResponse.json({
        error: 'Cannot connect to Ollama',
        response: 'Il server AI non è al momento disponibile. Riprova più tardi.'
      }, { status: 200 })
    }

    return NextResponse.json({
      error: 'Internal server error',
      response: 'Si è verificato un errore imprevisto. Riprova più tardi.'
    }, { status: 200 })
  }
}
