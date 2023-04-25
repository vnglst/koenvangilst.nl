import Image from 'next/image';
import Link from 'next/link';

import BlogPostCard from 'components/BlogPostCard';

export const revalidate = 60; // 1 minute

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-start max-w-2xl border-gray-200 dark:border-gray-700 mx-auto pb-16 min-h-screen">
      <article className="flex flex-col-reverse sm:flex-row items-start">
        <div className="flex flex-col pr-8">
          <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-1 text-black dark:text-white">
            Koen van Gilst
          </h1>
          <h2 className="text-gray-700 dark:text-gray-200 mb-4">
            Lead Frontend Developer at{' '}
            <span className="font-semibold">Rabobank</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-16">
            {`I'm a passionate and entrepreneurial web developer from the Netherlands who likes to push the web beyond its limits.`}
          </p>
        </div>
        <div className="w-[80px] sm:w-[176px] relative mb-8 sm:mb-0 mr-auto">
          <Image
            alt="Koen van Gilst"
            height={176}
            width={176}
            src="/avatar.jpg"
            className="rounded-full filter grayscale"
            priority
          />
        </div>
      </article>
      <h3 className="font-bold text-2xl md:text-4xl tracking-tight mb-6 text-black dark:text-white">
        Featured
      </h3>
      <section className="flex gap-6 flex-col md:flex-row">
        {/* @ts-expect-error Server Component */}
        <BlogPostCard
          title="Plotting the age of parliament with Livebook"
          slug="livebook-average-age-of-parliament"
        />
        {/* @ts-expect-error Server Component */}
        <BlogPostCard
          title="Code Colocation is King"
          slug="code-colocation-is-king"
        />
        {/* @ts-expect-error Server Component */}
        <BlogPostCard
          title="Live user cursors with Phoenix Presence"
          slug="phoenix-live-cursors"
        />
      </section>
      <Link
        href="/blog"
        className="flex content-center justify-center justify-items-center item-center mt-8 text-gray-600 dark:text-gray-400 leading-7 rounded-lg hover:text-gray-800 dark:hover:text-gray-200 transition-all h-6"
      >
        Read all posts
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="h-6 w-6 ml-1"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.5 12h-15m11.667-4l3.333 4-3.333-4zm3.333 4l-3.333 4 3.333-4z"
          />
        </svg>
      </Link>
    </div>
  );
}
