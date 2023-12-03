import { PropsWithChildren } from 'react';

export function Article({ children }: PropsWithChildren<{}>) {
  return <article className="prose dark:prose-dark">{children}</article>;
}
