import type { MDXProps } from 'mdx/types';
import { CodeBlock } from './CodeBlock';

import { ContentImage } from './ContentImage';
import { Note } from './Note';

import { Icon } from '#/components/ui/Icon';
import { Link } from '#/components/ui/Link';

function Bleed({ children }: { children: React.ReactNode }) {
  return <div className="article-media">{children}</div>;
}

function Waypoint({ href }: { href: string }) {
  return (
    <div className="article-waypoint">
      <Icon icon="external-link" className="ml-1 inline h-4 w-4" />{' '}
      <Link href={href} className="ml-2" externalIndicator={false}>
        Commit on Github
      </Link>
    </div>
  );
}

const mdxComponents = {
  pre: CodeBlock,
  img: ContentImage,
  Image: ContentImage, // MDX compatibility alias for posts that use an Image component
  a: Link,
  Bleed,
  Disclaimer: Note,
  Waypoint
};

type MDXComponentProps = {
  Component: React.ComponentType<MDXProps>;
};

export function MDXComponent({ Component }: MDXComponentProps) {
  return <Component components={mdxComponents} />;
}
