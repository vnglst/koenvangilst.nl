import type { ComponentProps } from 'react';
import { MDXProvider } from '@mdx-js/react';

import { cx } from '#/lib/clsx';

import { Icon } from '#/components/ui/Icon';
import { Link } from '#/components/ui/Link';

function RoundedImage({ alt = '', label, ...props }: ComponentProps<'img'> & { label?: React.ReactNode }) {
  const className = cx('mt-1 mb-0 inline-block rounded-lg');

  if (!label) {
    return <img alt={alt} loading="lazy" {...props} className={className} />;
  }

  return (
    <figure className="mt-1 mb-0 inline-block">
      <img alt={alt} loading="lazy" {...props} className={className} />
      <figcaption className="mt-1 text-center text-gray-600 dark:text-gray-400">{label}</figcaption>
    </figure>
  );
}

export function Disclaimer({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-md border-l-8 border-gray-400 bg-gray-200 p-2 px-8 dark:border-gray-500 dark:bg-gray-800">
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function Waypoint({ href }: { href: string }) {
  return (
    <div className="my-5 md:ml-[-27px]">
      <Icon icon="external-link" className="ml-1 inline h-4 w-4" />{' '}
      <a href={href} className="ml-2" target="_blank" rel="noopener noreferrer">
        Commit on Github
      </a>
    </div>
  );
}

const mdxComponents = {
  img: RoundedImage,
  Image: RoundedImage, // next/image alias used in legacy MDX posts
  a: Link,
  Disclaimer,
  Waypoint,
};

type MDXComponentProps = {
  Component: React.ComponentType;
};

export function MDXComponent({ Component }: MDXComponentProps) {
  return (
    <MDXProvider components={mdxComponents}>
      <Component />
    </MDXProvider>
  );
}
