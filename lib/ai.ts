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

const OLLAMA_URL = 'http://localhost:11434/api/chat'

type ProviderName = 'openai' | 'anthropic' | 'gemini' | 'openrouter' | 'ollama'

interface ProviderConfig {
  name: ProviderName
  defaultModel: string
  baseUrl: string
  apiKey?: string
}

const DEFAULT_JSON_MODEL = 'gpt-4o-mini'

function resolveProvider(): ProviderConfig {
  const explicit = (process.env.AI_PROVIDER || '').toLowerCase()

  const providers: ProviderConfig[] = [
    {
      name: 'openai',
      defaultModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      baseUrl: 'https://api.openai.com/v1/chat/completions',
      apiKey: process.env.OPENAI_API_KEY,
    },
    {
      name: 'openrouter',
      defaultModel: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
      baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: process.env.OPENROUTER_API_KEY,
    },
    {
      name: 'anthropic',
      defaultModel: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest',
      baseUrl: 'https://api.anthropic.com/v1/messages',
      apiKey: process.env.ANTHROPIC_API_KEY,
    },
    {
      name: 'gemini',
      defaultModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
      apiKey: process.env.GEMINI_API_KEY,
    },
  ]

  if (explicit && explicit !== 'ollama' && explicit !== 'auto') {
    const match = providers.find(p => p.name === explicit)
    if (match?.apiKey) return match
  }

  const configured = providers.find(p => p.apiKey)
  if (configured) return configured

  return { name: 'ollama', defaultModel: 'llama3', baseUrl: OLLAMA_URL }
}

function buildMessages(system: string, messages: AiMessage[]): AiMessage[] {
  return [{ role: 'system', content: system }, ...messages]
}

async function callOpenAICompatible(cfg: ProviderConfig, msgs: AiMessage[], opts: AiChatOptions): Promise<AiChatResult> {
  const model = opts.model || cfg.defaultModel
  const res = await fetch(cfg.baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cfg.name === 'openrouter' ? { Authorization: `Bearer ${cfg.apiKey}` } : { Authorization: `Bearer ${cfg.apiKey}` }),
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
    throw new Error(`${cfg.name} API error ${res.status}: ${errText}`)
  }

  const data: any = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error(`${cfg.name} API: empty response`)
  return { content, provider: cfg.name, model }
}

async function callAnthropic(cfg: ProviderConfig, msgs: AiMessage[], opts: AiChatOptions): Promise<AiChatResult> {
  const model = opts.model || cfg.defaultModel
  const system = msgs.filter(m => m.role === 'system').map(m => m.content).join('\n\n')
  const rest = msgs.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content }))

  const res = await fetch(cfg.baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': cfg.apiKey!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      system,
      messages: rest,
      max_tokens: opts.maxTokens ?? 2048,
      temperature: opts.temperature ?? 0.7,
      stream: false,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`anthropic API error ${res.status}: ${errText}`)
  }

  const data: any = await res.json()
  const content = data.content?.[0]?.text
  if (!content) throw new Error('anthropic API: empty response')
  return { content, provider: cfg.name, model }
}

async function callGemini(cfg: ProviderConfig, msgs: AiMessage[], opts: AiChatOptions): Promise<AiChatResult> {
  const model = opts.model || cfg.defaultModel
  const system = msgs.filter(m => m.role === 'system').map(m => m.content).join('\n\n')
  const rest = msgs.filter(m => m.role !== 'system').map(m => m.content)

  const url = `${cfg.baseUrl}/${model}:generateContent?key=${encodeURIComponent(cfg.apiKey!)}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: system ? { parts: [{ text: system }] } : undefined,
      contents: rest.map(text => ({ role: 'user', parts: [{ text }] })),
      generationConfig: {
        temperature: opts.temperature ?? 0.7,
        maxOutputTokens: opts.maxTokens ?? 2048,
        ...(opts.json ? { responseMimeType: 'application/json' } : {}),
      },
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`gemini API error ${res.status}: ${errText}`)
  }

  const data: any = await res.json()
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!content) throw new Error('gemini API: empty response')
  return { content, provider: cfg.name, model }
}

async function callOllama(cfg: ProviderConfig, msgs: AiMessage[], opts: AiChatOptions): Promise<AiChatResult> {
  const model = opts.model || cfg.defaultModel
  const res = await fetch(cfg.baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: msgs,
      stream: false,
      options: {
        temperature: opts.temperature ?? 0.7,
        num_predict: opts.maxTokens ?? 2048,
      },
    }),
  })

  if (!res.ok) {
    throw new Error(`ollama API error ${res.status}`)
  }

  const data: any = await res.json()
  const content = data.message?.content
  if (!content) throw new Error('ollama API: empty response')
  return { content, provider: 'ollama', model }
}

/**
 * Chat completions multi-provider.
 *
 * Provider resolution (priority):
 *   1. AI_PROVIDER env (openai | openrouter | anthropic | gemini) if the matching key is set
 *   2. First available API key among OPENAI_API_KEY, OPENROUTER_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY
 *   3. Ollama (localhost) as fallback when no API key is configured
 *
 * Suggested model for social media analysis work (Italian, JSON output, creator coaching):
 *   - OpenAI: gpt-4o-mini (default, good quality/cost balance)
 *   - Override per call with `model` or globally with OPENAI_MODEL / ANTHROPIC_MODEL / GEMINI_MODEL / OPENROUTER_MODEL.
 */
export async function aiChat(system: string, messages: AiMessage[], opts: AiChatOptions = {}): Promise<AiChatResult> {
  const cfg = resolveProvider()
  const msgs = buildMessages(system, messages)

  if (cfg.name === 'ollama') {
    return callOllama(cfg, msgs, opts)
  }

  if (cfg.name === 'anthropic') {
    return callAnthropic(cfg, msgs, opts)
  }

  if (cfg.name === 'gemini') {
    return callGemini(cfg, msgs, opts)
  }

  return callOpenAICompatible(cfg, msgs, opts)
}

/** Convenience helper for JSON-structured generation. */
export async function aiChatJson(system: string, messages: AiMessage[], opts: AiChatOptions = {}): Promise<AiChatResult> {
  return aiChat(system, messages, { ...opts, json: true })
}

export { DEFAULT_JSON_MODEL }