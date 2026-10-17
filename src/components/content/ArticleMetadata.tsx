import type { ReactNode } from 'react';

export function ArticleMetadata({
  publishedAt,
  readingTimeText,
  children
}: {
  publishedAt: string;
  readingTimeText: string;
  children?: ReactNode;
}) {
  return (
    <div className="article-metadata">
      <time dateTime={publishedAt}>
        {new Date(publishedAt).toLocaleDateString('en-US', {
                timeZone: 'UTC',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </time>
      {(readingTimeText || children) && (
        <span>
          {readingTimeText}
          {readingTimeText && children && <span aria-hidden="true"> · </span>}
          {children}
        </span>
      )}
    </div>
  );
}
