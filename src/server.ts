import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server'

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.youtube.com",
  "script-src-elem 'self' blob: 'unsafe-inline'",
  "child-src 'self' blob: *.youtube.com",
  "style-src 'self' 'unsafe-inline'",
  'img-src * blob: data:',
  'media-src i.imgur.com github.com *.s3.amazonaws.com',
  'connect-src *',
  "font-src 'self'",
  "frame-src 'self' svelte.dev codesandbox.io tetris-time.koenvangilst.nl voronoi-virus.koenvangilst.nl dancing-mosquitoes.koenvangilst.nl pong-wars.koenvangilst.nl purple-rain.koenvangilst.nl particle-life.koenvangilst.nl time-flies.koenvangilst.nl aarde.koenvangilst.nl rock-paper-scissors.koenvangilst.nl stacked-game-of-life.koenvangilst.nl",
].join('; ')

const SECURITY_HEADERS: Record<string, string> = {
  'Content-Security-Policy': CSP,
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-DNS-Prefetch-Control': 'on',
}

const baseHandler = createStartHandler(defaultStreamHandler)

export default {
  async fetch(request: Request, opts?: Parameters<typeof baseHandler>[1]) {
    const response = await baseHandler(request, opts)
    const headers = new Headers(response.headers)
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
      headers.set(key, value)
    }
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  },
}
