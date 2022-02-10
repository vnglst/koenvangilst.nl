type Props = {
  title: string;
  summary: string;
  url: string;
  year: string;
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
                  <svg
                    className="h-4 w-4 ml-2 inline"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
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
