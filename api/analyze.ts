import { handleAnalyze } from './_core.js'

// Vercel serverless function wrapper — compiled separately from the frontend bundle.
// All env vars without VITE_ prefix (ANTHROPIC_API_KEY, APIFY_API_TOKEN, etc.)
// are only available here, never in the browser.

// Tempo máximo da função: o scraping do Instagram (Apify) pode levar ~25s e o
// padrão da Vercel (10s) mataria a função no meio. 60s cobre Apify + Jina + IA.
export const maxDuration = 60

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  // Server-Sent Events headers
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')
  res.flushHeaders?.()

  const send = (data: object) => {
    try { res.write(`data: ${JSON.stringify(data)}\n\n`) } catch { /* ignore */ }
  }

  const emitter = {
    loading: (step: string) => send({ type: 'loading', step }),
    delta:   (text: string) => send({ type: 'delta', text }),
    done:    (planName: string | null) => { send({ type: 'done', planName }); res.end() },
    error:   (message: string)        => { send({ type: 'error', message }); res.end() },
  }

  const ip =
    (typeof req.headers['x-forwarded-for'] === 'string'
      ? req.headers['x-forwarded-for'].split(',')[0]
      : req.socket?.remoteAddress) ?? 'unknown'

  try {
    await handleAnalyze(req.body, emitter, ip)
  } catch (err: any) {
    send({ type: 'error', message: err?.message ?? 'Erro interno.' })
    res.end()
  }
}
