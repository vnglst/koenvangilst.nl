import { Fragment } from 'react';

import { BlogPostLink } from '#/components/ui/PostLink';

type Entry = { title: string; summary: string; slug: string; publishedAt: string; url?: string };

/** Entries grouped under year labels, newest first, as on Articles and Lab. */
export function ArchiveByYear({ entries }: { entries: Entry[] }) {
  const displayedYears = new Set<string>();

  return (
    <div className="project-list">
      {entries.map((entry) => {
        const year = new Date(entry.publishedAt).getFullYear().toString();
        const showYear = !displayedYears.has(year);
        if (showYear) displayedYears.add(year);

        return (
          <Fragment key={entry.url ?? entry.slug}>
            {showYear && <h2 className="archive-year">{year}</h2>}
            <BlogPostLink {...entry} />
          </Fragment>
        );
      })}
    </div>
  );
}
