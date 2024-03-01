import Image from 'next/image';

import { Container } from './Container';
import { Heading } from './Heading';
import { MDXComponent } from './MDXComponent';
import { Prose } from './Prose';
import { Tag } from './Tag';
import { ViewCount } from './ViewCount';

type Props = {
  publishedAt: string;
  title: string;
  readingTime: any;
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
      <div className="mt-2 flex w-full flex-col items-start justify-between md:flex-row md:items-center">
        <div className="flex items-center">
          <Image
            alt="Koen van Gilst"
            height={24}
            width={24}
            src="/avatar.jpg"
            className="rounded-full"
            priority
          />
          <p className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            {'Koen van Gilst / '}
            {new Date(publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <p className="mt-2 min-w-32 text-sm text-gray-600 md:mt-0 dark:text-gray-400">
          {readingTime.text}
          {` • `}
          <ViewCount path={path} />
        </p>
      </div>
      <ul className="my-4 flex w-full flex-wrap gap-2">
        {tags?.map((tag: string) => (
          <li key={tag}>
            <Tag tag={tag} />
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
        <a href={getDiscussUrl(path)} target="_blank" rel="noopener noreferrer">
          {'Discuss on Twitter'}
        </a>
        {` • `}
        <a href={getEditUrl(path)} target="_blank" rel="noopener noreferrer">
          {'Edit on GitHub'}
        </a>
      </footer>
    </Container>
  );
}

function getEditUrl(path: string) {
  return `https://github.com/vnglst/koenvangilst.nl/edit/main/data${path}.mdx`;
}

function getDiscussUrl(path: string) {
  return `https://mobile.twitter.com/search?q=${encodeURIComponent(
    `https://koenvangilst.nl${path}`
  )}`;
}
