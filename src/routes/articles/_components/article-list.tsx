import { Text } from '#/components/ui/Text';
import { useNavigate, useSearch } from '@tanstack/react-router';

import { ArchiveByYear } from '#/components/content/ArchiveByYear';
import { Button } from '#/components/ui/Button';

type Article = {
  title: string;
  summary: string;
  tags: string[];
  slug: string;
  publishedAt: string;
  url?: string;
};

export function ArticleList({ articles }: { articles: Article[] }) {
  const search = useSearch({ from: '/articles/' });
  const navigate = useNavigate();
  // Every post here is tagged 'article', so that old filter value shows the whole list.
  const query = search.q && search.q !== 'article' ? search.q : '';
  const filtered = query
    ? articles.filter((post) => post.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())))
    : articles;
  const clearFilter = () => void navigate({ to: '/articles', search: { q: undefined } });

  return (
    <section>
      {query && (
        <div className="lab-filters">
          <Text>Articles tagged “{query}”</Text>
          <Button variant="outline" onClick={clearFilter}>
            All articles
          </Button>
        </div>
      )}
      {filtered.length === 0 ? (
        <div className="lab-empty" role="status">
          <Text className="mb-3">No matching articles</Text>
          <Button variant="outline" onClick={clearFilter}>
            Clear filter
          </Button>
        </div>
      ) : (
        <ArchiveByYear entries={filtered} />
      )}
    </section>
  );
}
