import { createFileRoute } from '@tanstack/react-router';
import { NotFoundPage } from '#/components/content/NotFoundPage';

export const Route = createFileRoute('/404')({
  component: NotFoundPage
});
