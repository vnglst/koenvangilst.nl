import { createFileRoute, redirect } from '@tanstack/react-router'

// Legacy redirect: /photography/photo/:id → /photography
export const Route = createFileRoute('/photography/photo/$')({
  beforeLoad: () => {
    throw redirect({ to: '/photography', statusCode: 302 })
  },
})
