import { PropsWithChildren } from 'react';

type ProseProps = {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
};

export function Prose({ children, as: Cmp = 'article', className }: PropsWithChildren<ProseProps>) {
  const classes = `${className} prose w-full max-w-none text-pretty dark:prose-dark`;
  return <Cmp className={classes}>{children}</Cmp>;
}
