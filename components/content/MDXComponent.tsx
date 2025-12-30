import { ComponentProps } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import Image from 'next/image';

import { cx } from 'lib/clsx';

import { Icon } from '../ui/Icon';
import { Link } from '../ui/Link';

function RoundedImage({ alt, label, ...props }: ComponentProps<typeof Image> & { label?: React.ReactNode }) {
  const className = cx('my-1 inline-block rounded-lg');

  if (!label) {
    return <Image alt={alt} {...props} className={className} />;
  }

  return (
    <figure className="my-1 inline-block">
      <Image alt={alt} {...props} className={className} />
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

type MDXComponentProps = { additionalComponents?: Record<string, React.ComponentType>; code: string };

export function MDXComponent({ additionalComponents, code }: MDXComponentProps) {
  const components = { Image: RoundedImage, a: Link, Disclaimer, Waypoint, ...additionalComponents };

  const Cmp = getMDXComponent(code);
  return <Cmp components={components} />;
}
