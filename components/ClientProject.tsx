import Link from 'next/link';

type Props = {
  title: string;
  summary: string;
  slug: string;
  year: string;
};

export default function ClientProject({ title, summary, slug, year }: Props) {
  return (
    <Link href={`/portfolio/${slug}`}>
      <a className="w-full">
        <article className="w-full mb-4 py-3 up-hover">
          <div className="flex items-baseline">
            <div className="text-primary  text-left mr-6 leading-2">{year}</div>
            <div className="w-full">
              <div className="flex flex-col justify-between md:flex-row">
                <h4 className="w-full mb-2 text-lg font-medium text-gray-900 md:text-xl dark:text-gray-100">
                  {title}
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{summary}</p>
            </div>
          </div>
        </article>
      </a>
    </Link>
  );
}
