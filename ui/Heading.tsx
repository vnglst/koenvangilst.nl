import React from 'react';

export function Heading({ children, level = 1, ...props }) {
  const Tag = `h${level}`;

  let className = '';

  switch (level) {
    case 1:
      className =
        'mb-4 text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white';
      break;
    case 2:
      className =
        'mt-8 mb-4 text-2xl font-bold tracking-tight text-black md:text-4xl dark:text-white';
      break;
    default:
      className =
        'mb-6 font-bold text-2xl md:text-4xl tracking-tight  text-black dark:text-white';
      break;
  }

  return React.createElement(Tag, { className, ...props }, children);
}
