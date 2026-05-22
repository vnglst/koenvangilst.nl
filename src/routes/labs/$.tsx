import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/labs/$')({ beforeLoad: ({ params }) => { const splat = params['_splat'] ?? ''; throw redirect({ href: `/lab/${splat}`, statusCode: 301 }) } })
