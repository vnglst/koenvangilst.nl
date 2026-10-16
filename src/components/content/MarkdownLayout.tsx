import { BackToLab } from '#/components/layout/BackToLab';
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
  Component: React.ComponentType;
};

export function MarkdownLayout({ post, Component }: Props) {
  const { slug, title, publishedAt, readingTime, tags, image } = post;
  return (
    <Container layout="reading">
      <article className="reading-column blog-article">
        <BackToLab />
        <PageHeader title={title}>
          <ArticleMetadata publishedAt={publishedAt} readingTimeText={readingTime.minutes > 0 ? readingTime.text : ''} />

          {tags.length > 0 && (
            <ul className="article-tags" aria-label="Article topics">
              {tags.map((tag) => (
                <li key={tag}>
                  <TagLink href={`/tag/${sluggify(tag)}`}>{tag}</TagLink>
                </li>
              ))}
            </ul>
          )}
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
          <Link href={`https://github.com/vnglst/koenvangilst.nl/edit/main/content/${slug}.mdx`}>Edit on GitHub</Link>
        </footer>
      </article>
    </Container>
  );
}
