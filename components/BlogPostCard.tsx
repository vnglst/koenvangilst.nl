import Link from 'next/link';

export default function BlogPostCard({ title, slug }) {
  return (
    <Link href={`/blog/${slug}`}>
      <a className="transform hover:scale-[1.02] transition-all rounded-xl w-full md:w-1/3 p-6 bg-gray-50 dark:bg-black border-dashed border-gray-400 border flex flex-col md:flex-row justify-between bg-gradient-to-b from-white dark:from-black to-gray-100 dark:to-gray-900">
        <h4 className="text-lg md:text-lg font-medium mb-6 sm:mb-10 w-full text-gray-900 dark:text-gray-100 tracking-tight">
          {title}
        </h4>
      </a>
    </Link>
  );
}
