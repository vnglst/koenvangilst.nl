import Link from 'next/link';

import Icon from './Icon';

type Props = {
  title: string;
  summary: string;
  href: string;
  year: number;
};

export function ProjectLink({ title, summary, href, year }: Props) {
  const isExternal = href.startsWith('http');

  const Cmp = isExternal ? 'a' : Link;

  const extraProps = isExternal
    ? {
        target: '_blank',
        rel: 'noopener noreferrer'
      }
    : {};

  return (
    <Cmp href={href} {...extraProps}>
      <article className="my-2 flex w-full flex-col items-baseline gap-2 p-1 md:flex-row">
        <div className="mr-5 text-left text-primary">{year}</div>
        <div className="up-hover">
          <div className="flex flex-col justify-between md:flex-row">
            <h4 className="mb-2 w-full text-lg font-medium text-gray-900 md:text-xl dark:text-gray-100">
              {title}
              {isExternal && (
                <Icon icon="external-link" className="ml-2 inline h-4 w-4" />
              )}
            </h4>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{summary}</p>
        </div>
      </article>
    </Cmp>
  );
}
