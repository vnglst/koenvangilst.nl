import { createFileRoute, redirect } from '@tanstack/react-router';

export function legacyRedirectRoute(from: string, to: string) {
  return createFileRoute(from as never)({
    beforeLoad: () => {
      throw redirect({ href: to, statusCode: 301 });
    }
  });
}

export function legacySplatRedirect(
  from: string,
  handler: (splat: string | undefined) => ReturnType<typeof redirect>
) {
  return createFileRoute(from as never)({
    beforeLoad: ({ params }: { params: Record<string, string | undefined> }) => {
      throw handler(params['_splat']);
    }
  });
}
