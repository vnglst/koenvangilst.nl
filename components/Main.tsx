import { PropsWithChildren } from 'react';

export function Main({ children }: PropsWithChildren) {
  return (
    <main
      id="content"
      className="flex flex-1 flex-col break-words bg-gray-50 bg-gradient-to-b from-white to-gray-100 dark:bg-gray-900 dark:from-black dark:to-gray-900"
    >
      {children}
    </main>
  );
}
