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
  publishedAt: string;
  title: string;
  readingTime: PostType['readingTime'];
  tags?: string[];
  path: string;
  image?: {
    alt: string;
    src: string;
    width: number;
    height: number;
    showAsHeader?: boolean;
  };
  Component: React.ComponentType;
};

export function MarkdownLayout({ publishedAt, title, readingTime, tags, path, image, Component }: Props) {
  return (
    <Container layout="reading">
      <article className="reading-column">
        <BackToLab />
        <PageHeader title={title}>
          <ArticleMetadata publishedAt={publishedAt} readingTimeText={readingTime.minutes > 0 ? readingTime.text : ''} />
          {tags && tags.length > 0 && (
            <ul className="article-tags">
              {tags.map((tag: string) => (
                <li key={tag}>
                  <TagLink href={`/tag/${sluggify(tag)}`}>{tag}</TagLink>
                </li>
              ))}
            </ul>
          )}
          {image && image.showAsHeader && (
            <ContentImage
              alt={image.alt}
              src={image.src}
              width={image.width}
              height={image.height}
              fetchPriority="high"
              className="my-5 inline-block"
            />
          )}
        </PageHeader>
        <Prose as="section">
          <Suspense fallback={<TextSkeleton />}>
            <MDXComponent Component={Component} />
          </Suspense>
        </Prose>
        <footer className="mt-8 text-sm text-[var(--muted)]">
          <Link href={getEditUrl(path)} className="font-normal">
            Edit on GitHub
          </Link>
        </footer>
      </article>
    </Container>
  );
}

const GITHUB_REPO = 'https://github.com/vnglst/koenvangilst.nl';

function getEditUrl(path: string) {
  const slug = path.split('/').pop();
  return `${GITHUB_REPO}/edit/main/content/${slug}.mdx`;
}
