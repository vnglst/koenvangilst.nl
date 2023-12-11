import React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};

export function Heading({
  children,
  className: extraClassName,
  level = 1,
  ...props
}: Props) {
  const Tag = `h${level}`;

  let className =
    'font-bold tracking-tight leading-none text-black dark:text-white ';

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

  return React.createElement(Tag, { className, ...props }, children);
}
