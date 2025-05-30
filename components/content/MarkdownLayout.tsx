import type { PostType } from 'cms/schema';
import Image from 'next/image';

import { sluggify } from 'lib/sluggify';

import { Container } from '../layout/Container';
import { Link } from '../ui/Link';
import { TagLink } from '../ui/Tag';
import { ArticleMetadata } from './ArticleMetadata';
import { Heading } from './Heading';
import { MDXComponent } from './MDXComponent';
import { Prose } from './Prose';

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
  code: string;
  additionalComponents?: Record<string, React.ComponentType>;
};

export async function MarkdownLayout({
  publishedAt,
  title,
  readingTime,
  tags,
  path,
  image,
  code,
  additionalComponents
}: Props) {
  return (
    <Container>
      <Heading level={1}>{title}</Heading>
      <ArticleMetadata publishedAt={publishedAt} readingTimeText={readingTime.text} />
      <ul className="my-4 flex w-full flex-wrap gap-2">
        {tags?.map((tag: string) => (
          <li key={tag}>
            <TagLink href={`/tag/${sluggify(tag)}`}>{tag}</TagLink>
          </li>
        ))}
      </ul>
      <Prose as="section">
        {image && image.showAsHeader ? (
          <Image
            alt={image.alt}
            src={image.src}
            width={image.width}
            height={image.height}
            className="inline-block rounded-lg"
            priority
          />
        ) : null}
        <MDXComponent code={code} additionalComponents={additionalComponents} />
      </Prose>
      <footer className="mt-8 text-sm text-gray-700 dark:text-gray-300">
        <Link href={getEditUrl(path)} className="font-normal">
          Edit on GitHub
        </Link>
      </footer>
    </Container>
  );
}

function getEditUrl(path: string) {
  return `https://github.com/vnglst/koenvangilst.nl/edit/main/data${path}.mdx`;
}
