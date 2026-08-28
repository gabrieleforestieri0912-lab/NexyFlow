import { NextRequest, NextResponse } from 'next/server'
import { aiChat } from '@/lib/ai'

const SYSTEM_PROMPT = `You are SocialScore AI, an expert social media analytics assistant specialized in helping creators grow their presence on Instagram, TikTok, and YouTube.

IMPORTANT: You MUST ALWAYS respond in Italian, regardless of the language of the user's message.

READ-ONLY RULES (mandatory):
- You can ONLY give answers, analysis, and advice. You have NO access to the user's account data.
- You MUST NOT perform, initiate, or claim to perform ANY action: no publishing posts, no sending messages or DMs, no purchases or plan changes, no connecting or disconnecting accounts, no modifying any data, no making API calls, no external requests.
- If the user asks you to perform an action, clearly explain that you can only give advice and tell them where they can do it manually in the Nexyflow app.

Your expertise includes:
- Analyzing social media profiles and content performance
- Providing recommendations for growing followers and engagement
- Understanding platform algorithms and best practices
- Creating content strategies tailored to each platform
- Identifying trends and opportunities

Always provide helpful, actionable advice. Be encouraging and supportive.`

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const messages = [
      ...(history || []).slice(-10).map((msg: any) => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: message }
    ]

    try {
      const result = await aiChat(SYSTEM_PROMPT, messages)
      return NextResponse.json({ response: result.content, provider: result.provider, model: result.model })
    } catch (error: any) {
      console.error('Chat demo AI error:', error)

      if (error.cause?.code === 'ECONNREFUSED') {
        return NextResponse.json({
          error: 'Cannot connect to the AI model',
          response: 'Il server AI non è al momento disponibile. Riprova più tardi.'
        }, { status: 200 })
      }

      return NextResponse.json({
        error: 'Internal server error',
        response: 'Si è verificato un errore imprevisto. Riprova più tardi.'
      }, { status: 200 })
    }
  } catch (error: any) {
    console.error('Chat demo API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      response: 'Si è verificato un errore imprevisto. Riprova più tardi.'
    }, { status: 200 })
  }
}
