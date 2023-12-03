import Icon from 'ui/Icon';

type Props = {
  title: string;
  summary: string;
  url: string;
  year: number;
};

export default function LabProject({ title, summary, url, year }: Props) {
  const isExternal = url.startsWith('https://');
  return (
    <a
      href={url}
      target={isExternal ? '_blank' : ''}
      className="w-full"
      rel="noreferrer"
    >
      <article className="up-hover mb-4 w-full py-3">
        <div className="flex items-baseline">
          <div className="mr-6 text-left text-primary">{year}</div>
          <div className="w-full">
            <div className="flex flex-col justify-between md:flex-row">
              <h4 className="mb-2 w-full text-lg font-medium text-gray-900 dark:text-gray-100 md:text-xl">
                {title}
                {isExternal && (
                  <Icon icon="external-link" className="ml-2 inline h-4 w-4" />
                )}
              </h4>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{summary}</p>
          </div>
        </div>
      </article>
    </a>
  );
}
