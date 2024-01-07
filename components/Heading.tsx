import React, { PropsWithChildren } from 'react';

type Props = {
  className?: string;
  centered?: boolean;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};

export function Heading({
  children,
  className: extraClassName,
  centered = false,
  level = 1,
  ...props
}: PropsWithChildren<Props>) {
  const Tag = `h${level}`;

  let className =
    'font-bold tracking-tight leading-none text-black dark:text-white text-balance ';

  switch (level) {
    case 1:
      className += 'my-3 text-4xl md:text-5xl';
      break;
    case 2:
      className += 'mt-10 mb-6 text-2xl md:text-4xl';
      break;
    default:
      className += 'mt-6 mb-4 text-xl md:text-3xl line';
      break;
  }

  if (extraClassName) {
    className += ' ' + extraClassName;
  }

  if (centered) {
    className += ' text-center w-full';
  }

  return React.createElement(Tag, { className, ...props }, children);
}
