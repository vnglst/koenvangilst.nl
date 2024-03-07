import { ComponentProps } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import Image from 'next/image';
import Link from 'next/link';

import { cx } from 'lib/clsx';

import { Icon } from './Icon';

const CustomLink = (props) => {
  const href = props.href;
  const isExternalLink = href && href.startsWith('http');

  if (isExternalLink)
    return <a target="_blank" rel="noopener noreferrer" {...props} />;

  return (
    <Link href={href} {...props}>
      {props.children}
    </Link>
  );
};

function RoundedImage({
  fullBleed,
  alt,
  ...props
}: ComponentProps<typeof Image> & { fullBleed?: boolean }) {
  const className = cx(
    'my-1 inline-block rounded-lg',
    fullBleed && 'lg:full-bleed'
  );

  return <Image alt={alt} {...props} className={className} />;
}

function Disclaimer({ children }) {
  return (
    <div className="rounded-md border-l-8 border-gray-400 bg-gray-200 p-2 px-8 dark:border-gray-500 dark:bg-gray-800">
      {children}
    </div>
  );
}

function Waypoint({ href }) {
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

export function MDXComponent({
  additionalComponents,
  code
}: MDXComponentProps) {
  const components = {
    Image: RoundedImage,
    a: CustomLink,
    Disclaimer,
    Waypoint,
    ...additionalComponents
  };

  const Cmp = getMDXComponent(code);
  return <Cmp components={components} />;
}
