import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { env } from './env.js'
import { getHomeHTML } from './html/home.js'
import { getAdminHTML } from './html/admin.js'
import { get404HTML } from './html/404.js'
import {
  handleShorten,
  handleRedirect,
  handleListLinks,
  handleDelete,
  handleStats,
} from './handlers.js'
import { requireTurnstile, handleTurnstileVerify } from './turnstile.js'

const app = new Hono()

// ── Security headers ──────────────────────────────────────────────────────────

const htmlHeaders = {
  'Content-Type': 'text/html; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Cache-Control': 'no-store',
}

// ── CORS ──────────────────────────────────────────────────────────────────────

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'X-API-Key', 'X-Session-Token'],
}))

// ── Bot / crawler detection ───────────────────────────────────────────────────
// These cannot complete a Turnstile challenge, so bypass it for link previews.

const CRAWLER_UA = [
  'facebookexternalhit',
  'facebookcatalog',
  'twitterbot',
  'telegrambot',
  'whatsapp',
  'slackbot',
  'slack-imgproxy',
  'linkedinbot',
  'discordbot',
  'pinterest',
  'googlebot',
  'bingbot',
  'applebot',
  'redditbot',
  'iframely',
  'embedly',
  'vkshare',
  'line-poker',
  'sogou',
  'tumblr',
  'skypeuripreview',
]

function isCrawler(request) {
  const ua = (request.headers.get('User-Agent') || '').toLowerCase()
  return CRAWLER_UA.some(bot => ua.includes(bot))
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Copies a Response from requireTurnstile() and layers htmlHeaders on top,
 * preserving the original status code and any Set-Cookie headers.
 */
function wrapWithHtmlHeaders(response) {
  const headers = new Headers(response.headers)
  for (const [key, value] of Object.entries(htmlHeaders)) {
    headers.set(key, value)
  }
  return new Response(response.body, { status: response.status, headers })
}

// ── Routes ────────────────────────────────────────────────────────────────────

// Turnstile token exchange
app.post('/api/turnstile/verify', async (c) => {
  return await handleTurnstileVerify(c.req.raw, env)
})

// Home page
app.get('/', async (c) => {
  const challenge = await requireTurnstile(c.req.raw, env)
  if (challenge) return wrapWithHtmlHeaders(challenge)
  return new Response(getHomeHTML(), { headers: htmlHeaders })
})

// Admin panel — no Turnstile, protected by API key at the data layer
app.get('/admin', (c) => {
  return new Response(getAdminHTML(), { headers: htmlHeaders })
})

// Create short link
app.post('/api/shorten', async (c) => {
  const challenge = await requireTurnstile(c.req.raw, env)
  if (challenge) return wrapWithHtmlHeaders(challenge)
  return await handleShorten(c.req.raw, env)
})

// List all links (admin)
app.get('/api/links', async (c) => {
  return await handleListLinks(c.req.raw, env)
})

// Delete a link (admin)
app.delete('/api/delete/:slug', async (c) => {
  const slug = c.req.param('slug')
  return await handleDelete(c.req.raw, env, `/api/delete/${slug}`)
})

// Link stats (admin)
app.get('/api/stats/:slug', async (c) => {
  const slug = c.req.param('slug')
  return await handleStats(c.req.raw, env, `/api/stats/${slug}`)
})

// Short-link redirect — must be last so it doesn't shadow API routes
app.get('/:slug', async (c) => {
  const slug = c.req.param('slug')

  if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
    return new Response(get404HTML(), { status: 404, headers: htmlHeaders })
  }

  // Skip Turnstile for known link-preview bots so OG metadata works
  if (!isCrawler(c.req.raw)) {
    const challenge = await requireTurnstile(c.req.raw, env, { requireFreshPathGrant: true })
    if (challenge) return wrapWithHtmlHeaders(challenge)
  }

  return await handleRedirect(slug, env)
})

// ── Global handlers ───────────────────────────────────────────────────────────

app.notFound((c) => {
  return new Response(get404HTML(), { status: 404, headers: htmlHeaders })
})

app.onError((err, c) => {
  console.error('[Error]', err)
  return new Response(JSON.stringify({ error: err.message }), {
    status: 500,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
})

// ── Server entry point (Bun) ──────────────────────────────────────────────────

const PORT = parseInt(process.env.PORT || '3000')
console.log(`🚀 LZVR Short running on http://localhost:${PORT}`)

export default {
  port: PORT,
  fetch: app.fetch,
}
