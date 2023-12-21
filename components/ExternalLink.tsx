import { PropsWithChildren } from 'react';

import Icon from './Icon';

type Props = {
  href: string;
  rel?: string;
};

export default function ExternalLink({
  href,
  children,
  rel
}: PropsWithChildren<Props>) {
  const extraRel = rel ? ` ${rel}` : '';

  return (
    <a
      className="text-gray-600 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      target="_blank"
      rel={`noopener noreferrer${extraRel}`}
      href={href}
    >
      {children}
      <Icon icon="external-link" className="ml-2 inline h-4 w-4" />
    </a>
  );
}
