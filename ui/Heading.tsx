import React from 'react';

export function Heading({ children, level = 1, ...props }) {
  const Tag = `h${level}`;

  let className = '';

  switch (level) {
    case 1:
      className =
        'my-4 text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white';
      break;
    case 2:
      className =
        'mt-10 mb-6 text-2xl md:text-4xl font-bold tracking-tight text-black dark:text-white';
      break;
    default:
      className =
        'mt-6 mb-4 text-xl md:text-3xl font-bold tracking-tight text-black dark:text-white';
      break;
  }

  return React.createElement(Tag, { className, ...props }, children);
}
