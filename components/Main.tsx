import { PropsWithChildren } from 'react';

export function Main({ children }: PropsWithChildren) {
  return (
    <main
      id="content"
      className="flex flex-1 flex-col break-words bg-gradient-to-b from-white to-[#f6fcfe] dark:bg-gray-900 dark:from-black dark:to-[#02071d]"
    >
      {children}
    </main>
  );
}
