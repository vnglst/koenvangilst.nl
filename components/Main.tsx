import { PropsWithChildren } from 'react';

export function Main({ children }: PropsWithChildren) {
  return (
    <main
      id="content"
      className="flex flex-1 flex-col break-words bg-gradient-to-b from-white to-slate-50 dark:bg-gray-900 dark:from-black dark:to-slate-900"
    >
      {children}
    </main>
  );
}
