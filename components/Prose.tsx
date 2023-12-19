import { ReactNode } from 'react';

type ProseProps = {
  as?: keyof JSX.IntrinsicElements;
  children: ReactNode;
};

export function Prose({ children, as: Cmp = 'article' }: ProseProps) {
  return (
    <Cmp className="prose w-full max-w-none text-pretty dark:prose-dark">
      {children}
    </Cmp>
  );
}
