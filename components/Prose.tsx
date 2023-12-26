import { PropsWithChildren } from 'react';

type ProseProps = {
  as?: keyof JSX.IntrinsicElements;
};

export function Prose({
  children,
  as: Cmp = 'article'
}: PropsWithChildren<ProseProps>) {
  return (
    <Cmp className="prose w-full max-w-none text-pretty dark:prose-dark">
      {children}
    </Cmp>
  );
}
