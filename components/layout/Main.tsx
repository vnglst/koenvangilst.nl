import { PropsWithChildren } from 'react';

export function Main({ children }: PropsWithChildren) {
  return (
    <main id="content" className="flex w-full flex-1 flex-col break-words">
      {children}
    </main>
  );
}
