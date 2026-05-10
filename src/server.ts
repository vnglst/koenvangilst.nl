import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server'
import { createReadStream, existsSync, statSync } from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'

const COMPRESSIBLE = /^(text\/|application\/(javascript|json|xml|manifest)|image\/svg)/

// Streaming compression via Web Streams API (Node 18+) — never buffers, stream-safe
function tryCompress(req: Request, res: Response): Response {
  const ct = res.headers.get('content-type') ?? ''
  if (!COMPRESSIBLE.test(ct) || !res.body) return res

  const accept = req.headers.get('accept-encoding') ?? ''
  const headers = new Headers(res.headers)
  headers.delete('content-length') // length changes after compression
  headers.set('Vary', 'Accept-Encoding')

  if (accept.includes('gzip')) {
    headers.set('Content-Encoding', 'gzip')
    return new Response(res.body.pipeThrough(new CompressionStream('gzip')), {
      status: res.status, statusText: res.statusText, headers,
    })
  }
  if (accept.includes('deflate')) {
    headers.set('Content-Encoding', 'deflate')
    return new Response(res.body.pipeThrough(new CompressionStream('deflate')), {
      status: res.status, statusText: res.statusText, headers,
    })
  }
  return res
}

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

const MIME_TYPES: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.avif': 'image/avif',
  '.map': 'application/json',
}

function getCacheControl(urlPath: string): string {
  // Content-hashed JS/CSS bundles — safe to cache forever
  if (urlPath.startsWith('/assets/')) return 'public, max-age=31536000, immutable'
  // Fonts — stable filenames, long-lived
  if (urlPath.startsWith('/fonts/')) return 'public, max-age=31536000, immutable'
  // Photography images and other static content — 1 week
  if (urlPath.startsWith('/static/')) return 'public, max-age=604800'
  // Favicons etc — 1 day
  return 'public, max-age=86400'
}

// Find built client assets dir (hashed JS/CSS, fonts, public files)
// Docker: /app/client (dist/* is copied to /app/ by Dockerfile)
// Local:  dist/client
function findClientDir(): string {
  const docker = path.join(process.cwd(), 'client')
  if (existsSync(docker)) return docker
  const local = path.join(process.cwd(), 'dist', 'client')
  if (existsSync(local)) return local
  return ''
}

// Public dir holds runtime-generated files (photography-optimized images, photos-data.json)
// Always at <cwd>/public in both local and Docker environments
const CLIENT_DIR = findClientDir()
const PUBLIC_DIR = path.join(process.cwd(), 'public')

async function tryServeFile(filePath: string, urlPath: string, request: Request): Promise<Response | null> {
  if (!existsSync(filePath)) return null
  let stat: ReturnType<typeof statSync>
  try {
    stat = statSync(filePath)
    if (!stat.isFile()) return null
  } catch {
    return null
  }

  const etag = `"${stat.size.toString(36)}-${stat.mtime.getTime().toString(36)}"`
  if (request.headers.get('if-none-match') === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } })
  }

  const ext = path.extname(filePath).toLowerCase()
  const mimeType = MIME_TYPES[ext] ?? 'application/octet-stream'
  const webStream = Readable.toWeb(createReadStream(filePath)) as ReadableStream

  return new Response(webStream, {
    headers: {
      'Content-Type': mimeType,
      'Content-Length': String(stat.size),
      'Cache-Control': getCacheControl(urlPath),
      'Last-Modified': stat.mtime.toUTCString(),
      ETag: etag,
    },
  })
}

async function serveStatic(urlPath: string, request: Request): Promise<Response | null> {
  // Prevent directory traversal
  const normalized = path.posix.normalize(urlPath)
  if (!normalized.startsWith('/') || normalized.includes('..')) {
    return new Response('Forbidden', { status: 403 })
  }
  const rel = normalized.slice(1) // strip leading /

  // 1. Built assets (hashed bundles, fonts, icons, etc)
  if (CLIENT_DIR) {
    const p = path.join(CLIENT_DIR, rel)
    if (p.startsWith(CLIENT_DIR)) {
      const res = await tryServeFile(p, urlPath, request)
      if (res) return res
    }
  }

  // 2. Runtime-generated public files (photography images generated at startup)
  const p = path.join(PUBLIC_DIR, rel)
  if (p.startsWith(PUBLIC_DIR)) {
    const res = await tryServeFile(p, urlPath, request)
    if (res) return res
  }

  return null
}

const baseHandler = createStartHandler(defaultStreamHandler)

export default {
  async fetch(request: Request, opts?: Parameters<typeof baseHandler>[1]) {
    const url = new URL(request.url)

    // Serve static files with proper cache headers (bypasses SSR for asset requests)
    if (request.method === 'GET' || request.method === 'HEAD') {
      const staticResponse = await serveStatic(url.pathname, request)
      if (staticResponse) {
        if (request.method === 'HEAD') {
          return new Response(null, { status: staticResponse.status, headers: staticResponse.headers })
        }
        return tryCompress(request, staticResponse)
      }
    }

    // SSR / API handler — add security headers to all dynamic responses
    const response = await baseHandler(request, opts)
    const headers = new Headers(response.headers)
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
      headers.set(key, value)
    }
    const ssrResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
    return tryCompress(request, ssrResponse)
  },
}
