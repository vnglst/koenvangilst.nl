import Link from 'next/link';

export const metadata = {
  title: '404 – Not found'
};

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-start max-w-2xl mx-auto mb-16">
      <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">
        404 – Not found
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        {`It seems you've found something that used to exist, or you spelled something
            wrong. I'm guessing you spelled something wrong. Can you double-check that URL?`}
      </p>
      <Link
        href="/"
        className="p-1 sm:p-4 w-64 font-bold bg-gray-200 dark:bg-gray-800 text-center rounded-md text-black dark:text-white"
      >
        Return Home
      </Link>
    </div>
  );
}
