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
      <article className="w-full mb-4 py-3 up-hover">
        <div className="flex items-baseline">
          <div className="text-primary text-left mr-6">{year}</div>
          <div className="w-full">
            <div className="flex flex-col justify-between md:flex-row">
              <h4 className="w-full mb-2 text-lg font-medium text-gray-900 md:text-xl dark:text-gray-100">
                {title}
                {isExternal && (
                  <Icon icon="external-link" className="h-4 w-4 ml-2 inline" />
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
