import { PropsWithChildren } from 'react';

export function Body({ children }: PropsWithChildren) {
  return (
    <body className="bg-slate-50 text-gray-800 antialiased dark:bg-slate-950 dark:text-gray-100">
      <script
        defer
        id="theme"
        dangerouslySetInnerHTML={{
          __html: `
          
          // This script is responsible for setting the correct theme on page load.
          // This has to be done in the head to avoid a flash of the wrong mode
          // (sometimes also referred to as FOUC, or Flash of Unstyled Content).
          // The theme is set by adding the 'dark' class to the <html> element.
          
          const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const preferredTheme = localStorage.getItem('theme');

          if (preferredTheme) {
            if (preferredTheme === 'dark') {
              document.documentElement.classList.add('dark');
            }
          } else if (systemDark) {
            document.documentElement.classList.add('dark');
          }
          `
        }}
      />
      {children}
    </body>
  );
}
