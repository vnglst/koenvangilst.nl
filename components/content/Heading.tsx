import React, { PropsWithChildren } from 'react';

type Props = {
  className?: string;
  centered?: boolean;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  id?: string;
};

export function Heading({
  children,
  className: extraClassName,
  centered = false,
  level = 1,
  ...props
}: PropsWithChildren<Props>) {
  const Tag = `h${level}`;

  let className = 'font-bold tracking-tight leading-none text-slate-800 dark:text-slate-200 text-balance ';

  switch (level) {
    case 1:
      className += 'my-3 text-3xl md:text-4xl';
      break;
    case 2:
      className += 'my-3 my-3 text-xl md:text-2xl font-sans font-medium';
      break;
    default:
      className += 'my-3 text-lg md:text-xl font-sans font-medium';
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
