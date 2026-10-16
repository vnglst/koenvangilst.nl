import { Link } from './Link';
import { Heading } from '#/components/content/Heading';
import { dateFormatter } from '#/lib/formatters';
import { Icon } from './Icon';

type BlogPostLinkProps = {
  title: string;
  summary: string;
  slug: string;
  publishedAt: string;
  url?: string;
  compact?: boolean;
};
export function BlogPostLink({ title, summary, url, slug, publishedAt, compact = false }: BlogPostLinkProps) {
  const href = url || `/lab/${slug}`;
  const content = (
    <article className={compact ? 'post-entry post-entry-compact' : 'post-entry'}>
      <time dateTime={publishedAt}>{dateFormatter(publishedAt)}</time>
      <div>
        <Heading level={3} size={3} className="post-title">
          {title}
          {url?.startsWith('http') && <Icon icon="external-link" className="ml-2 inline h-3 w-3" />}
        </Heading>
        <p>{summary}</p>
      </div>
    </article>
  );
  return (
    <Link href={href} variant="plain" externalIndicator={false} className="post-link">
      {content}
    </Link>
  );
}
