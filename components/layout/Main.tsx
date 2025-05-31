import { PropsWithChildren } from 'react';

export function Main({ children }: PropsWithChildren) {
  return (
    <main id="content" className="flex flex-1 flex-col break-words bg-white dark:bg-black">
      {children}
    </main>
  );
}
