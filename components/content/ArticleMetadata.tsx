export function ArticleMetadata({ publishedAt, readingTimeText }: { publishedAt: string; readingTimeText: string }) {
  return (
    <div className="mt-2 flex w-full items-center justify-between text-sm text-gray-600 dark:text-gray-400">
      <p>
        {new Date(publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>
      <p>{readingTimeText}</p>
    </div>
  );
}
