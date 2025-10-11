import Link from 'next/link';

import { Icon } from './Icon';

type BlogPostLinkProps = {
  title: string;
  summary: string;
  slug: string;
  publishedAt: string;
  showYear?: boolean;
  url?: string;
};

export function BlogPostLink({ title, summary, url, slug, publishedAt, showYear }: BlogPostLinkProps) {
  const href = url || `/lab/${slug}`;
  const isExternal = href.startsWith('http');
  const year = new Date(publishedAt).getFullYear();
  const linkProps = isExternal ? { href, target: '_blank', rel: 'noopener noreferrer' } : { href };
  const LinkComponent = isExternal ? 'a' : Link;

  return (
    <LinkComponent {...linkProps}>
      <article className="my-1 flex w-full flex-col items-baseline gap-2 p-1 md:flex-row">
        <div className={showYear ? 'text-primary mr-5 text-left' : 'mr-5 hidden md:invisible md:block'}>{year}</div>
        <div className="up-hover">
          <h4 className="mb-2 w-full text-lg font-normal text-gray-900 md:text-xl dark:text-gray-100">
            {title}
            {isExternal && <Icon icon="external-link" className="ml-2 inline h-4 w-4" />}
          </h4>
          <p className="text-gray-600 dark:text-gray-400">{summary}</p>
        </div>
      </article>
    </LinkComponent>
  );
}
