import { Link } from '#/components/ui/Link';
import { dateFormatter } from '#/lib/formatters';
import { Heading } from './Heading';

type RecentArticle = { slug: string; title: string; publishedAt: string; url?: string };
export function RecentArticles({ articles }: { articles: RecentArticle[] }) {
  return <section aria-labelledby="recent-articles-title">
    <Heading level={2} size={3} id="recent-articles-title" className="recent-heading">Recent articles</Heading>
    <ul className="recent-list">{articles.map((article) => <li key={article.slug} className="recent-entry">
      <time className="recent-date" dateTime={article.publishedAt}>{dateFormatter(article.publishedAt)}</time>
      <Link className="recent-link" variant="plain" externalIndicator={false} href={article.url || `/lab/${article.slug}`}>{article.title}</Link>
    </li>)}</ul>
  </section>;
}
