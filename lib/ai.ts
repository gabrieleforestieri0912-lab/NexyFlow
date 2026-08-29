export interface AiMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AiChatOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  json?: boolean
}

export interface AiChatResult {
  content: string
  provider: string
  model: string
}

const DEFAULT_JSON_MODEL = 'gpt-4o-mini'

function buildMessages(system: string, messages: AiMessage[]): AiMessage[] {
  return [{ role: 'system', content: system }, ...messages]
}

async function callOpenAI(msgs: AiMessage[], opts: AiChatOptions): Promise<AiChatResult> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('No OpenAI API key configured. Set OPENAI_API_KEY in your environment variables.')
  }

  const model = opts.model || process.env.OPENAI_MODEL || 'gpt-4o-mini'

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: msgs,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.maxTokens ?? 2048,
      stream: false,
      ...(opts.json ? { response_format: { type: 'json_object' } } : {}),
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`openai API error ${res.status}: ${errText}`)
  }

  const data: any = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('openai API: empty response')
  return { content, provider: 'openai', model }
}

/**
 * Chat completions OpenAI-only.
 *
 * Requires OPENAI_API_KEY in the environment. The model defaults to gpt-4o-mini
 * and can be overridden per call with `model` or globally with OPENAI_MODEL.
 */
export async function aiChat(system: string, messages: AiMessage[], opts: AiChatOptions = {}): Promise<AiChatResult> {
  const msgs = buildMessages(system, messages)
  return callOpenAI(msgs, opts)
}

/** Convenience helper for JSON-structured generation. */
export async function aiChatJson(system: string, messages: AiMessage[], opts: AiChatOptions = {}): Promise<AiChatResult> {
  return aiChat(system, messages, { ...opts, json: true })
}

export { DEFAULT_JSON_MODEL }
