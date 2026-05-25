import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load ALL env vars (not just VITE_) so the dev middleware can read secrets
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  // Ensure NODE_ENV is set — _core.js uses it to skip rate-limiting in dev
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = mode === 'production' ? 'production' : 'development'
  }

  return {
    plugins: [
      react(),

      // ─── /api/analyze dev middleware ─────────────────────────────────────
      // Mirrors what Vercel's serverless function does in production.
      // Removed automatically in production builds — this plugin only runs in dev.
      {
        name: 'api-analyze-dev',
        apply: 'serve',
        configureServer(server) {
          server.middlewares.use('/api/analyze', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            // Parse JSON body
            let body
            try {
              const raw = await new Promise((resolve, reject) => {
                let chunks = ''
                req.on('data', c => { chunks += c })
                req.on('end', () => resolve(chunks))
                req.on('error', reject)
              })
              body = JSON.parse(raw)
            } catch {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid JSON' }))
              return
            }

            // SSE headers
            res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
            res.setHeader('Cache-Control', 'no-cache, no-transform')
            res.setHeader('Connection', 'keep-alive')
            res.flushHeaders()

            const send = data => {
              try { res.write(`data: ${JSON.stringify(data)}\n\n`) } catch { /* ignore */ }
            }

            const emitter = {
              loading: step    => send({ type: 'loading', step }),
              delta:   text    => send({ type: 'delta', text }),
              done:    name    => { send({ type: 'done', planName: name }); res.end() },
              error:   message => { send({ type: 'error', message }); res.end() },
            }

            const ip =
              (typeof req.headers['x-forwarded-for'] === 'string'
                ? req.headers['x-forwarded-for'].split(',')[0]
                : req.socket?.remoteAddress) ?? 'unknown'

            try {
              // Dynamic import so Node.js resolves it at runtime, not at Vite config load
              const { handleAnalyze } = await import('./api/_core.js')
              await handleAnalyze(body, emitter, ip)
            } catch (err) {
              send({ type: 'error', message: err?.message ?? 'Erro interno.' })
              res.end()
            }
          })
        },
      },
    ],
  }
})
