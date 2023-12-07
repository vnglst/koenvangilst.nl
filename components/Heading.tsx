import React from 'react';

export function Heading({ children, level = 1, ...props }) {
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

  return React.createElement(Tag, { className, ...props }, children);
}
