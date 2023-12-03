import { PropsWithChildren } from 'react';
import NextLink from 'next/link';

import Icon from 'ui/Icon';

type Props = {
  header: string;
  link: string;
  metric: number | Promise<number>;
};

export default async function MetricCard({ header, link, metric }: Props) {
  const isExternalLink = link.startsWith('https://');
  const metricNumber = await metric;

  const className =
    'bg-white dark:bg-gray-900 border border-dashed border-gray-400 rounded-lg p-4 max-w-72 w-full text-gray-900 dark:text-gray-100';

  const Link = isExternalLink ? ExternalLink : NextLink;

  return (
    <Link className={className} href={link}>
      <div className="flex items-center">
        {header}
        {isExternalLink ? (
          <Icon icon="external-link" className="ml-1 h-4 w-4" />
        ) : null}
      </div>
      <p className="spacing-sm mt-2 text-3xl font-bold text-black dark:text-white">
        {metricNumber > 0 ? metricNumber.toLocaleString() : '-'}
      </p>
    </Link>
  );
}

function ExternalLink({
  href,
  className,
  children
}: PropsWithChildren<{ href: string; className: string }>) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      className={className}
    >
      {children}
    </a>
  );
}
