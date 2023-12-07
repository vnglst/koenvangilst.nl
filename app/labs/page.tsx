import { getProjects } from 'cms/queries';

import { Container } from 'components/Container';
import { Heading } from 'components/Heading';
import Icon from 'components/Icon';
import { Prose } from 'components/Prose';

export const metadata = {
  title: 'Labs',
  description:
    'A list of JavaScript experiments. Mostly small (educational) apps for my kids or to learn a new technology myself.',
  alternates: {
    canonical: 'labs'
  }
};

export default async function Labs() {
  const sorted = (await getProjects()).sort(
    (a, b) => Number(b.year) - Number(a.year)
  );

  return (
    <Container>
      <Prose>
        <Heading level={1}>JavaScript Labs</Heading>
        <p>
          Below, you'll find a collection of JavaScript projects I've been
          tinkering with. You'll see a mix of educational progressive web apps,
          a couple of Twitter bots, and some other fun creations. I mainly use
          these as playgrounds to dive deeper into new tech or libraries, so the
          code is just me having a bit of fun. Nothing too formal! 🐒
        </p>
      </Prose>
      <Heading level={2}>Side projects</Heading>
      {sorted.map((client) => {
        return (
          <LabProjectLink
            title={client.name}
            year={client.year}
            summary={client.summary}
            url={client.url}
            key={client.url}
          />
        );
      })}
    </Container>
  );
}

type Props = {
  title: string;
  summary: string;
  url: string;
  year: number;
};

function LabProjectLink({ title, summary, url, year }: Props) {
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
