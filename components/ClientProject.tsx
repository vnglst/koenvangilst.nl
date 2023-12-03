import Link from 'next/link';

type Props = {
  title: string;
  summary: string;
  slug: string;
  year: number;
};

export default function ClientProject({ title, summary, slug, year }: Props) {
  return (
    <Link href={`/portfolio/${slug}`} className="w-full">
      <article className="up-hover mb-4 w-full py-3">
        <div className="flex items-baseline">
          <div className="leading-2  mr-6 text-left text-primary">{year}</div>
          <div className="w-full">
            <div className="flex flex-col justify-between md:flex-row">
              <h4 className="mb-2 w-full text-lg font-medium text-gray-900 dark:text-gray-100 md:text-xl">
                {title}
              </h4>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{summary}</p>
          </div>
        </div>
      </article>
    </Link>
  );
}
