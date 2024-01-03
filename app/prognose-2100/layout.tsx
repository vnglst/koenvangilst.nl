import Link from 'next/link';

export default async function Layout({ children }) {
  return (
    <div>
      <nav className="mb-8 flex w-full max-w-screen-md items-center gap-5 text-slate-700 dark:text-slate-300">
        <Link
          href="/prognose-2100"
          className="block whitespace-nowrap rounded-md border-2 border-slate-900 bg-[#74e2ff] px-3 py-1 text-2xl font-black text-slate-900 dark:border-white dark:text-slate-900"
        >
          Prognose 2100
        </Link>
        <Link
          href="/prognose-2100/about"
          className="block whitespace-nowrap p-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="h-5 w-5"
          >
            <path
              fill="currentColor"
              d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 18h-2v-8h2v8zm-1-12.25c.69 0 1.25.56 1.25 1.25s-.56 1.25-1.25 1.25-1.25-.56-1.25-1.25.56-1.25 1.25-1.25z"
            />
          </svg>
        </Link>
      </nav>
      {children}
    </div>
  );
}
