import { createFileRoute, redirect } from '@tanstack/react-router'

// Legacy redirects: /blog/feed → /feed.xml, /blog/* → /lab/*
export const Route = createFileRoute('/blog/$')({
  beforeLoad: ({ params }) => {
    const splat = params['_splat'] ?? ''
    if (splat === 'feed') {
      throw redirect({ href: '/feed.xml', statusCode: 301 })
    }
    throw redirect({ href: `/lab/${splat}`, statusCode: 301 })
  },
})
