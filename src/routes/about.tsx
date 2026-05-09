import { createFileRoute, redirect } from '@tanstack/react-router'

// /about was never a real page - redirect to home
export const Route = createFileRoute('/about')({
  loader: () => redirect({ to: '/', throw: true }),
  component: () => null,
})
