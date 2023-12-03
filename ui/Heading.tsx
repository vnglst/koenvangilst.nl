import React from 'react';

export function Heading({ children, level = 1, ...props }) {
  const Tag = `h${level}`;

  let className = 'font-bold tracking-tight text-black dark:text-white ';

  switch (level) {
    case 1:
      className += 'my-4 text-3xl md:text-5xl ';
      break;
    case 2:
      className += 'mt-10 mb-6 text-2xl md:text-4xl ';
      break;
    default:
      className += 'mt-6 mb-4 text-xl md:text-3xl ';
      break;
  }

  return React.createElement(Tag, { className, ...props }, children);
}
