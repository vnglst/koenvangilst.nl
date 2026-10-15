import { Text } from '#/components/ui/Text';

export function ArticleMetadata({
  publishedAt,
  readingTimeText,
  children
}: {
  publishedAt: string;
  readingTimeText: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mt-2 flex w-full items-center justify-between text-sm text-[var(--muted)]">
      <Text size="small" tone="muted">
        {new Date(publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </Text>
      <Text size="small" tone="muted" className="flex items-center gap-2">
        {readingTimeText}
        {children && (
          <>
            <span>·</span>
            {children}
          </>
        )}
      </Text>
    </div>
  );
}
