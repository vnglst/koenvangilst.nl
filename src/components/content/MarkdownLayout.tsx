import type { MDXProps } from 'mdx/types';
import { SectionLink } from '#/components/layout/SectionLink';
import { ARTICLE_TAG } from '#/cms/article-tag';
import type { PostType } from '#/cms/schema';

import { sluggify } from '#/lib/sluggify';
import { Suspense } from 'react';

import { Container } from '../layout/Container';
import { Link } from '../ui/Link';
import { TagLink } from '../ui/Tag';
import { ArticleMetadata } from './ArticleMetadata';
import { MDXComponent } from './MDXComponent';
import { Prose } from './Prose';
import { PageHeader } from '../layout/PageHeader';
import { TextSkeleton } from './LoadingState';
import { ContentImage } from './ContentImage';

type Props = {
  post: Pick<PostType, 'slug' | 'title' | 'publishedAt' | 'readingTime' | 'tags' | 'image'>;
  Component: React.ComponentType<MDXProps>;
  /** The next article to read, shown quietly below the article. */
  nextArticle?: { slug: string; title: string } | null;
};

export function MarkdownLayout({ post, Component, nextArticle }: Props) {
  const { slug, title, publishedAt, readingTime, tags, image } = post;
  // Every post here is an article, so the section tag adds nothing below one.
  const topics = tags.filter((tag) => tag !== ARTICLE_TAG);
  return (
    <Container layout="reading">
      <article className="reading-column blog-article">
        <SectionLink href="/articles" label="Articles" />
        <PageHeader title={title}>
          <ArticleMetadata publishedAt={publishedAt} readingTimeText={readingTime.minutes > 0 ? readingTime.text : ''} />
        </PageHeader>
        {image?.showAsHeader && (
          <ContentImage
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="eager"
            fetchPriority="high"
            className="article-cover"
          />
        )}
        <Prose as="div" className="article-body">
          <Suspense fallback={<TextSkeleton />}>
            <MDXComponent Component={Component} />
          </Suspense>
        </Prose>
        <footer className="article-footer">
          {topics.length > 0 && (
            <ul className="article-tags" aria-label="Article topics">
              {topics.map((tag) => (
                <li key={tag}>
                  <TagLink href={`/tag/${sluggify(tag)}`}>{tag}</TagLink>
                </li>
              ))}
            </ul>
          )}
          <Link
            href={`https://github.com/vnglst/koenvangilst.nl/edit/main/content/${slug}.mdx`}
            variant="plain"
            className="article-edit"
          >
            Edit on GitHub
          </Link>
        </footer>
        {nextArticle && (
          <nav className="article-next" aria-label="Next article">
            <Link href={`/articles/${nextArticle.slug}`} variant="plain" className="post-link article-next-link">
              <span className="article-next-label">Next article</span>
              <span className="post-title article-next-title">{nextArticle.title}</span>
            </Link>
          </nav>
        )}
      </article>
    </Container>
  );
}
