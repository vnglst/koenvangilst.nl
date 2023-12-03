import Image from 'next/image';
import Link from 'next/link';

export default function SnippetCard({
  title,
  description,
  slug,
  logo,
  views,
  ...rest
}) {
  return (
    <Link
      href={`/snippets/${slug}`}
      className="up-hover w-full rounded-xl border border-dashed border-gray-400 bg-gray-50 p-4 dark:bg-black"
      {...rest}
    >
      <div className="flex content-baseline justify-between">
        <Image
          alt={title}
          height={32}
          width={32}
          src={`/static/logos/${logo}`}
          className="rounded-full"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {views} views
        </span>
      </div>
      <h3 className="mt-2 text-left text-lg font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="mt-1 text-gray-700 dark:text-gray-400">{description}</p>
    </Link>
  );
}
