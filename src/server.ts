import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server'

// Nginx handles: static file serving, gzip compression, security headers, rate limiting.
// This handler is only reached for SSR and API requests (localhost:3001, internal).
export default { fetch: createStartHandler(defaultStreamHandler) }
