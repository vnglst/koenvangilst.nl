import { PropsWithChildren } from 'react';

export function Article({ children }: PropsWithChildren<{}>) {
  return (
    <article className="prose leading-6 break-words text-gray-600 dark:text-gray-400">
      {children}
    </article>
  );
}
