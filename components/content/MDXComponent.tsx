import { ComponentProps } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import Image from 'next/image';

import { cx } from 'lib/clsx';

import { Icon } from '../ui/Icon';
import { Link } from '../ui/Link';

function RoundedImage({ alt, ...props }: ComponentProps<typeof Image>) {
  const className = cx('my-1 inline-block rounded-lg');

  return <Image alt={alt} {...props} className={className} />;
}

export function Disclaimer({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border-l-8 border-gray-400 bg-gray-200 p-2 px-8 dark:border-gray-500 dark:bg-gray-800">
      {children}
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

type MDXComponentProps = {
  additionalComponents?: Record<string, React.ComponentType>;
  code: string;
};

export function MDXComponent({ additionalComponents, code }: MDXComponentProps) {
  const components = {
    Image: RoundedImage,
    a: Link,
    Disclaimer,
    Waypoint,
    ...additionalComponents
  };

  const Cmp = getMDXComponent(code);
  return <Cmp components={components} />;
}
